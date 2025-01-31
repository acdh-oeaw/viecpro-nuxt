import { log, range } from "@acdh-oeaw/lib";
import type { SearchResponseHit } from "typesense/lib/Typesense/Documents";
import type { MultiSearchRequestSchema } from "typesense/lib/Typesense/MultiSearch";
import * as v from "valibot";

import { env } from "@/config/env.config";
import { emptyDate, limit, maxDate, maxFacetValues, minDate } from "@/config/search.config";
import { ensureArray } from "@/lib/ensure-array";
import { convertYearToTimestamp } from "@/lib/timestamp";
import { client } from "@/lib/typesense/client";

export interface Person {
	kind: "person";
	id: string;
	name: string;
	firstName?: string;
	startDate: number;
	endDate: number;
	startDateWritten?: string;
	endDateWritten?: string;
	gender: string;
	functions: Array<string>;
	institutions: Array<string>;
	status: "gelb" | "grün" | "rot";
}

const collection = [env.NEXT_PUBLIC_TYPESENSE_COLLECTION_PREFIX, "person"].join("");

const queryFields = ["name", "firstName"] as const;
const sortFields = ["name", "firstName", "startDate", "endDate", "status"] as const;
const facetFields = ["functions", "gender", "institutions", "status"] as const;

type _QueryField = (typeof queryFields)[number];
export type SortField = (typeof sortFields)[number];
export type FacetField = (typeof facetFields)[number];

export interface FacetValueCount {
	count: number;
	highlighted: string;
	isSelected: boolean;
	value: string;
}

export const SearchFiltersSchema = v.pipe(
	v.object({
		page: v.fallback(
			v.pipe(v.string(), v.transform(Number), v.number(), v.integer(), v.minValue(1)),
			1,
		),

		sort: v.fallback(v.picklist(sortFields), "name"),
		"sort-direction": v.fallback(v.picklist(["asc", "desc"]), "asc"),

		q: v.fallback(v.pipe(v.string()), ""),

		"start-date": v.fallback(
			v.pipe(
				v.string(),
				v.transform(Number),
				v.number(),
				v.integer(),
				v.minValue(minDate),
				v.maxValue(maxDate),
			),
			minDate,
		),
		"end-date": v.fallback(
			v.pipe(
				v.string(),
				v.transform(Number),
				v.number(),
				v.integer(),
				v.minValue(minDate),
				v.maxValue(maxDate),
			),
			maxDate,
		),
		"empty-date": v.fallback(v.picklist(["include", "omit"]), "include"),

		functions: v.fallback(v.pipe(v.unknown(), v.transform(ensureArray), v.array(v.string())), []),
		gender: v.fallback(v.pipe(v.unknown(), v.transform(ensureArray), v.array(v.string())), []),
		institutions: v.fallback(
			v.pipe(v.unknown(), v.transform(ensureArray), v.array(v.string())),
			[],
		),
		status: v.fallback(v.pipe(v.unknown(), v.transform(ensureArray), v.array(v.string())), []),
	}),

	v.transform((value) => {
		if (value["start-date"] > value["end-date"]) {
			[value["start-date"], value["end-date"]] = [value["end-date"], value["start-date"]];
		}

		return value;
	}),
);

export type SearchFilters = v.InferOutput<typeof SearchFiltersSchema>;

export function getSearchFilters(searchParams: SearchParams): SearchFilters {
	return v.parse(SearchFiltersSchema, searchParams);
}

function generateFilter(searchFilters: SearchFilters) {
	const start = convertYearToTimestamp(searchFilters["start-date"]);
	const end = convertYearToTimestamp(searchFilters["end-date"]);
	const range =
		searchFilters["empty-date"] === "omit"
			? `[${String(start)}..${String(end)}]`
			: `[${String(start)}..${String(end)},${String(emptyDate)}]`;
	const dateRangeFilter = [`startDate:${range}`, `endDate:${range}`].join(" && ");

	const facetFilters = new Map<FacetField, string>();

	for (const facetField of facetFields) {
		const values = searchFilters[facetField];

		if (values.length === 0) continue;

		facetFilters.set(
			facetField,
			`${facetField}:=[${values
				.sort()
				.map((value) => {
					return `\`${value}\``;
				})
				.join(",")}]`,
		);
	}

	function createFilter(omit?: string) {
		const filters = [dateRangeFilter];

		facetFilters.forEach((filter, facetField) => {
			if (facetField === omit) return;

			filters.push(filter);
		});

		return filters.join(" && ");
	}

	return { createFilter, facetFilters };
}

function sortFacets(a: FacetValueCount, z: FacetValueCount) {
	if (a.isSelected && !z.isSelected) return -1;
	if (!a.isSelected && z.isSelected) return 1;
	if (a.count !== z.count) return z.count - a.count;
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
}

export async function getSearchResults(
	searchFilters: SearchFilters,
): Promise<SearchResults<Person>> {
	const { createFilter, facetFilters } = generateFilter(searchFilters);

	const searches: Array<MultiSearchRequestSchema> = [
		{
			page: searchFilters.page,
			per_page: limit,
			highlight_full_fields: queryFields.join(","),
			sort_by: `${searchFilters.sort}:${searchFilters["sort-direction"]}`,
			facet_by: facetFields.join(","),
			filter_by: createFilter(),
		},
	];

	const _facetFilterFields = Array.from(facetFilters.keys());

	/**
	 * Additional queries to get unfiltered list of available facet values.
	 *
	 * @see https://typesense.org/docs/guide/faqs.html#how-do-i-get-facet-counts-for-values-that-users-have-not-filtered-on
	 */
	facetFilters.forEach((filter, facetField) => {
		searches.push({
			per_page: 0,
			facet_by: facetField,
			filter_by: createFilter(facetField),
		});
	});

	/**
	 * FIXME: Unfortunately, typesense does not guarantee that selected facet values will
	 * be included in the facet counts.
	 *
	 * @see https://github.com/typesense/typesense/issues/2131
	 * @see https://github.com/algolia/instantsearch/discussions/6482#discussioncomment-11759867
	 */
	const response = await client.multiSearch.perform<Array<Person>>(
		{ searches },
		{
			collection,
			query_by: queryFields.join(","),
			q: searchFilters.q || "*",
			max_facet_values: maxFacetValues,
		},
	);

	const errors = response.results.filter((response) => {
		return "error" in response;
	});

	if (errors.length > 0) {
		log.error(errors);
		throw new Error("Failed to fetch data.");
	}

	const searchResponse = response.results.at(0)!;

	const total = searchResponse.out_of;
	const count = searchResponse.found;
	const page = searchFilters.page;
	const pages = Math.ceil(count / limit);
	const hits =
		searchResponse.hits?.map((hit) => {
			return { document: hit.document, highlight: hit.highlight };
		}) ?? [];

	const facetCounts = new Map<FacetField, { values: Array<FacetValueCount> }>();

	for (const facet of searchResponse.facet_counts ?? []) {
		const facetField = facet.field_name as FacetField;

		const selected = new Set(searchFilters[facetField]);

		const values = new Map<string, FacetValueCount>();

		if (facetFilters.has(facetField)) {
			// TODO: ugh, maybe better in a separate loop: facetFilters.forEach((_, key) => facetCounts.set(key, ...))
			const index = Array.from(facetFilters.keys()).indexOf(facetField);
			const unfilteredValues = response.results.at(index + 1)!.facet_counts!.at(0)!.counts;

			for (const { count, highlighted, value } of unfilteredValues) {
				const isSelected = selected.has(value);
				values.set(value, { count, highlighted, isSelected, value });
			}

			for (const { count, highlighted, value } of facet.counts) {
				const isSelected = selected.has(value);
				if (!values.has(value) && isSelected) {
					values.set(value, { count, highlighted, isSelected, value });
				}
			}
		} else {
			for (const { count, highlighted, value } of facet.counts) {
				const isSelected = selected.has(value);
				values.set(value, { count, highlighted, isSelected, value });
			}
		}

		selected.forEach((value) => {
			/**
			 * Selected facet values are not guaranteed to be included in the returned facet counts.
			 * See FIXME: above.
			 * We currently work around this issue the same way algolia does, by setting a count of 0.
			 */
			if (!values.has(value)) {
				values.set(value, { count: 0, highlighted: "", isSelected: true, value });
			}
		});

		const sorted = Array.from(values.values()).sort(sortFacets);

		facetCounts.set(facetField, { values: sorted });
	}

	return {
		total,
		count,
		pages,
		page,
		hits,
		facets: facetCounts,
	};
}

export async function getSearchFacetValues(
	searchFilters: SearchFilters,
	facetField: FacetField,
	q: string,
) {
	const { createFilter } = generateFilter(searchFilters);

	const response = await client.multiSearch.perform<Array<Person>>(
		{
			searches: [
				{
					per_page: 0,
					facet_by: facetField,
					facet_query: `${facetField}:=\`${q}\``,
					filter_by: createFilter(facetField),
				},
			],
		},
		{
			collection,
			query_by: queryFields.join(","),
			q: searchFilters.q || "*",
			max_facet_values: maxFacetValues,
		},
	);

	const errors = response.results.filter((response) => {
		return "error" in response;
	});

	if (errors.length > 0) {
		log.error(errors);
		throw new Error("Failed to fetch data.");
	}

	const searchResponse = response.results.at(0)!;
	const facet = (searchResponse.facet_counts ?? []).at(0)!;

	const selected = new Set(searchFilters[facetField]);

	const values = new Map<string, FacetValueCount>();

	for (const { count, highlighted, value } of facet.counts) {
		const isSelected = selected.has(value);
		values.set(value, { count, highlighted, isSelected, value });
	}

	return {
		values: Array.from(values.values()),
	};
}

export async function downloadCollection(
	searchFilters: SearchFilters,
	count: number,
): Promise<Array<Person>> {
	const { createFilter } = generateFilter(searchFilters);

	/**
	 * FIXME: currently, typesense export does not support `q`, only `filter_by`
	 *
	 * @see https://github.com/typesense/typesense/issues/485
	 */
	// const response = await client.collections(collection).documents().export({
	// 	filter_by: createFilter(),
	// 	// q: searchFilters.q,
	// });

	const limit = 250;
	const pages = Math.ceil(count / limit);

	/**
	 * Second-best option: fetch all pages of search results in a single multi-search request.
	 *
	 * The max number of allowed search requests is set by `limit_multi_searches`, which defaults to 50.
	 *
	 * @see https://typesense.org/docs/27.1/api/federated-multi-search.html#multi-search-parameters
	 *
	 * Note that we cannot just set `limit_multi_searches: pages` because we run into timeout errors after 5000ms.
	 */
	const searchResponse = await client.multiSearch.perform<Array<Person>>(
		{
			searches: range(1, pages).map((page) => {
				return { page };
			}),
		},
		{
			collection,
			query_by: queryFields.join(","),
			q: searchFilters.q || "*",
			per_page: limit,
			sort_by: `${searchFilters.sort}:${searchFilters["sort-direction"]}`,
			filter_by: createFilter(),
			// limit_multi_searches: pages,
		},
	);

	const hits = searchResponse.results.flatMap((response) => {
		return (
			response.hits?.map((hit) => {
				return hit.document;
			}) ?? []
		);
	});

	return hits;
}
