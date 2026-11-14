import { log, range } from "@acdh-oeaw/lib";
import type { SearchResponseHit } from "typesense/lib/Typesense/Documents";
import type { MultiSearchRequestSchema } from "typesense/lib/Typesense/Types";
import * as v from "valibot";

import { env } from "#/config/env.config.ts";
import { limit, maxFacetValues } from "#/config/search.config.ts";
import { ensureArray } from "#/lib/ensure-array.ts";
import { client } from "#/lib/typesense/client.ts";

/** Generic term ("Oberbegriff"), grouping several function terms. */
export interface FunctionalIndexEntry {
	kind: "function";
	id: string;
	name: string;
	fieldOfActivity?: string;
	definition?: string;
	source?: string;
	/** References to `FunctionalTerm` ids. */
	functions?: Array<string>;
}

/** Function term, as used in the `functions` facet of the person collection. */
export interface FunctionalTerm {
	id: string;
	name: string;
	nameReverse?: string;
	synonyms?: Array<string>;
}

export const indexCollection = [
	env.NEXT_PUBLIC_TYPESENSE_COLLECTION_PREFIX,
	"FunctionalIndex",
].join("");
export const termsCollection = [
	env.NEXT_PUBLIC_TYPESENSE_COLLECTION_PREFIX,
	"FunctionalTerms",
].join("");

export interface FunctionalIndexSearchResult extends Omit<FunctionalIndexEntry, "functions"> {
	terms: Array<Pick<FunctionalTerm, "id" | "name" | "synonyms">>;
}

const queryFields = ["name"] as const;
const termQueryFields = ["name", "synonyms"] as const;
const sortFields = ["name"] as const;
const facetFields = ["fieldOfActivity"] as const;

export type SortField = (typeof sortFields)[number];
export type FacetField = (typeof facetFields)[number];

export interface FacetValueCount {
	count: number;
	highlighted: string;
	isSelected: boolean;
	value: string;
}

export const SearchFiltersSchema = v.object({
	page: v.fallback(
		v.pipe(v.string(), v.transform(Number), v.number(), v.integer(), v.minValue(1)),
		1,
	),

	sort: v.fallback(v.picklist(sortFields), "name"),
	"sort-direction": v.fallback(v.picklist(["asc", "desc"]), "asc"),

	q: v.fallback(v.pipe(v.string()), ""),

	fieldOfActivity: v.fallback(
		v.pipe(v.unknown(), v.transform(ensureArray), v.array(v.string())),
		[],
	),
});

export type SearchFilters = v.InferOutput<typeof SearchFiltersSchema>;

export function getSearchFilters(searchParams: SearchParams): SearchFilters {
	return v.parse(SearchFiltersSchema, searchParams);
}

function escape(value: string): string {
	return `\`${value}\``;
}

function assertNoErrors(results: Array<object>): void {
	const errors = results.filter((result) => {
		return "error" in result;
	});

	if (errors.length > 0) {
		log.error(errors);
		throw new Error("Failed to fetch data.");
	}
}

/**
 * Collects all ids of documents in `collection` matching the query `q` across all result pages.
 */
async function getMatchingIds(
	collection: string,
	queryFields: ReadonlyArray<string>,
	q: string,
): Promise<Array<string>> {
	const perPage = 250;

	const params = {
		collection,
		q,
		query_by: queryFields.join(","),
		include_fields: "id",
		per_page: perPage,
	};

	const first = await client.multiSearch.perform<Array<{ id: string }>>({
		searches: [{ ...params, page: 1 }],
	});
	assertNoErrors(first.results);

	const response = first.results.at(0)!;
	const ids =
		response.hits?.map((hit) => {
			return hit.document.id;
		}) ?? [];
	const pages = Math.ceil(response.found / perPage);

	if (pages > 1) {
		const rest = await client.multiSearch.perform<Array<{ id: string }>>({
			searches: range(2, pages).map((page) => {
				return Object.assign({}, params, { page });
			}),
		});
		assertNoErrors(rest.results);

		for (const result of rest.results) {
			for (const hit of result.hits ?? []) {
				ids.push(hit.document.id);
			}
		}
	}

	return ids;
}

/**
 * Typesense cannot combine a full-text query on the generic term with a full-text query on the
 * referenced function terms. We therefore resolve the text query to document ids first, and
 * then filter the generic terms by "name matches, or any of its function terms matches".
 */
async function generateFilter(searchFilters: SearchFilters) {
	const filters: Array<string> = [];

	/** Ids of function terms matching the text query, used to highlight matches in the results. */
	const matchedTermIds = new Set<string>();

	const q = searchFilters.q.trim();

	if (q !== "") {
		const [indexIds, termIds] = await Promise.all([
			getMatchingIds(indexCollection, queryFields, q),
			getMatchingIds(termsCollection, termQueryFields, q),
		]);

		for (const id of termIds) {
			matchedTermIds.add(id);
		}

		const textFilters: Array<string> = [];
		if (indexIds.length > 0) {
			textFilters.push(`id:[${indexIds.join(",")}]`);
		}
		if (termIds.length > 0) {
			textFilters.push(`functions:[${termIds.join(",")}]`);
		}

		/** Nothing matches: use a filter which matches no documents. */
		filters.push(textFilters.length > 0 ? `(${textFilters.join(" || ")})` : "id:[-1]");
	}

	const facetFilters = new Map<FacetField, string>();

	for (const facetField of facetFields) {
		const values = searchFilters[facetField];

		if (values.length === 0) {
			continue;
		}

		facetFilters.set(facetField, `${facetField}:=[${values.toSorted().map(escape).join(",")}]`);
	}

	function createFilter(omit?: FacetField) {
		const result = [...filters];

		facetFilters.forEach((filter, facetField) => {
			if (facetField === omit) {
				return;
			}

			result.push(filter);
		});

		return result.join(" && ");
	}

	return { createFilter, facetFilters, matchedTermIds };
}

function sortFacets(a: FacetValueCount, z: FacetValueCount) {
	if (a.isSelected && !z.isSelected) {
		return -1;
	}
	if (!a.isSelected && z.isSelected) {
		return 1;
	}
	if (a.count !== z.count) {
		return z.count - a.count;
	}
	return a.value.localeCompare(z.value);
}

export interface SearchResults<T extends object, TFacetField = FacetField> {
	/** Total number of documents in collection. */
	total: number;
	/** Total number of matching documents. */
	count: number;
	/** Total number of pages. */
	pages: number;
	/** Current page. */
	page: number;
	/** Current page of matching documents. */
	hits: Array<Pick<SearchResponseHit<T>, "document" | "highlight">>;
	/** Facet counts. */
	facets: Map<TFacetField, { values: Array<FacetValueCount> }>;
	/** Ids of function terms which matched the text query. */
	matchedTermIds: Array<string>;
}

type JoinedFunctionalIndexEntry = Omit<FunctionalIndexEntry, "functions"> & Record<string, unknown>;

function toSearchResult(document: JoinedFunctionalIndexEntry): FunctionalIndexSearchResult {
	const { [termsCollection]: terms, ...entry } = document;

	return {
		...(entry as Omit<FunctionalIndexEntry, "functions">),
		kind: "function",
		terms: ((terms ?? []) as FunctionalIndexSearchResult["terms"]).toSorted((a, z) => {
			return a.name.localeCompare(z.name);
		}),
	};
}

export async function getSearchResults(
	searchFilters: SearchFilters,
): Promise<SearchResults<FunctionalIndexSearchResult>> {
	const { createFilter, facetFilters, matchedTermIds } = await generateFilter(searchFilters);

	const searches: Array<MultiSearchRequestSchema<JoinedFunctionalIndexEntry, string>> = [
		{
			page: searchFilters.page,
			per_page: limit,
			sort_by: `${searchFilters.sort}:${searchFilters["sort-direction"]}`,
			facet_by: facetFields.join(","),
			filter_by: createFilter(),
			include_fields: `id,name,fieldOfActivity,$${termsCollection}(id,name,synonyms)`,
		},
	];

	/**
	 * Additional queries to get unfiltered list of available facet values.
	 *
	 * @see https://typesense.org/docs/guide/faqs.html#how-do-i-get-facet-counts-for-values-that-users-have-not-filtered-on
	 */
	facetFilters.forEach((_filter, facetField) => {
		searches.push({
			per_page: 0,
			facet_by: facetField,
			filter_by: createFilter(facetField),
		});
	});

	const response = await client.multiSearch.perform<Array<JoinedFunctionalIndexEntry>>(
		{ searches },
		{
			collection: indexCollection,
			q: "*",
			max_facet_values: maxFacetValues,
		},
	);

	assertNoErrors(response.results);

	const searchResponse = response.results.at(0)!;

	const total = searchResponse.out_of;
	const count = searchResponse.found;
	const page = searchFilters.page;
	const pages = Math.ceil(count / limit);
	const hits =
		searchResponse.hits?.map((hit) => {
			return { document: toSearchResult(hit.document), highlight: {} };
		}) ?? [];

	const facetCounts = new Map<FacetField, { values: Array<FacetValueCount> }>();

	for (const facet of searchResponse.facet_counts ?? []) {
		const facetField = facet.field_name as FacetField;

		const selected = new Set(searchFilters[facetField]);

		const values = new Map<string, FacetValueCount>();

		const counts = facetFilters.has(facetField)
			? response.results
					.at(Array.from(facetFilters.keys()).indexOf(facetField) + 1)!
					.facet_counts!.at(0)!
					.counts.concat(facet.counts)
			: facet.counts;

		for (const { count, highlighted, value } of counts) {
			if (values.has(value)) {
				continue;
			}
			values.set(value, { count, highlighted, isSelected: selected.has(value), value });
		}

		/** Selected facet values are not guaranteed to be included in the returned facet counts. */
		selected.forEach((value) => {
			if (!values.has(value)) {
				values.set(value, { count: 0, highlighted: "", isSelected: true, value });
			}
		});

		facetCounts.set(facetField, { values: Array.from(values.values()).sort(sortFacets) });
	}

	return {
		total,
		count,
		pages,
		page,
		hits,
		facets: facetCounts,
		matchedTermIds: Array.from(matchedTermIds),
	};
}

export async function getSearchFacetValues(
	searchFilters: SearchFilters,
	facetField: FacetField,
	q: string,
) {
	const { createFilter } = await generateFilter(searchFilters);

	const response = await client.multiSearch.perform<Array<FunctionalIndexEntry>>(
		{
			searches: [
				{
					per_page: 0,
					facet_by: facetField,
					facet_query: `${facetField}:=${escape(q)}`,
					filter_by: createFilter(facetField),
				},
			],
		},
		{
			collection: indexCollection,
			q: "*",
			max_facet_values: maxFacetValues,
		},
	);

	assertNoErrors(response.results);

	const facet = (response.results.at(0)!.facet_counts ?? []).at(0)!;

	const selected = new Set(searchFilters[facetField]);

	return {
		values: facet.counts.map(({ count, highlighted, value }) => {
			return { count, highlighted, isSelected: selected.has(value), value };
		}),
	};
}

/** Number of function terms, and how many of them are assigned to a generic term. */
export async function getTermStatistics(): Promise<{ total: number; assigned: number }> {
	const response = await client.multiSearch.perform<Array<FunctionalTerm>>(
		{
			searches: [{ per_page: 0 }, { per_page: 0, filter_by: `$${indexCollection}(id:*)` }],
		},
		{ collection: termsCollection, q: "*" },
	);

	assertNoErrors(response.results);

	return {
		total: response.results.at(0)!.found,
		assigned: response.results.at(1)!.found,
	};
}
