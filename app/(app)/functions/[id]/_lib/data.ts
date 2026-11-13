import { log } from "@acdh-oeaw/lib";
import { cache } from "react";

import {
	type FunctionalIndexEntry,
	type FunctionalTerm,
	indexCollection,
	termsCollection,
} from "@/app/(app)/search/functions/_lib/search";
import { env } from "@/config/env.config";
import { client } from "@/lib/typesense/client";

const personCollection = [env.NEXT_PUBLIC_TYPESENSE_COLLECTION_PREFIX, "person"].join("");

export interface FunctionalIndexEntryDetails extends Omit<FunctionalIndexEntry, "functions"> {
	terms: Array<FunctionalTerm & { personCount: number }>;
	/** Number of persons with at least one of the function terms. */
	personCount: number;
}

type JoinedFunctionalIndexEntry = Omit<FunctionalIndexEntry, "functions"> & {
	[key: string]: unknown;
};

function escape(value: string): string {
	return `\`${value}\``;
}

/**
 * Returns `null` when no generic term with the given id exists.
 */
export const getFunction = cache(async function getFunction(
	id: string,
): Promise<FunctionalIndexEntryDetails | null> {
	const response = await client.multiSearch.perform<Array<JoinedFunctionalIndexEntry>>({
		searches: [
			{
				collection: indexCollection,
				q: "*",
				filter_by: `id:=${escape(id)}`,
				include_fields: `*,$${termsCollection}(*)`,
				exclude_fields: "functions",
				per_page: 1,
			},
		],
	});

	const result = response.results.at(0)!;

	if ("error" in result) {
		log.error(result);
		throw new Error("Failed to fetch data.");
	}

	const document = result.hits?.at(0)?.document;

	if (document == null) return null;

	const { [termsCollection]: _terms, ...entry } = document;
	const terms = ((_terms ?? []) as Array<FunctionalTerm>).toSorted((a, z) => {
		return a.name.localeCompare(z.name);
	});

	const personCounts = await getPersonCounts(
		terms.map((term) => {
			return term.name;
		}),
	);

	return {
		...(entry as Omit<FunctionalIndexEntry, "functions">),
		kind: "function",
		personCount: personCounts.total,
		terms: terms.map((term) => {
			return { ...term, personCount: personCounts.byTerm.get(term.name) ?? 0 };
		}),
	};
});

/**
 * Function term names are the values of the `functions` facet in the person collection.
 */
async function getPersonCounts(names: Array<string>) {
	const byTerm = new Map<string, number>();

	if (names.length === 0) return { total: 0, byTerm };

	const response = await client.multiSearch.perform<Array<{ functions: Array<string> }>>({
		searches: [
			{
				collection: personCollection,
				q: "*",
				filter_by: `functions:=[${names.map(escape).join(",")}]`,
				facet_by: "functions",
				/**
				 * Persons usually have more than one function, so we need enough facet values to
				 * include all of the requested ones.
				 */
				max_facet_values: 10_000,
				per_page: 0,
			},
		],
	});

	const result = response.results.at(0)!;

	if ("error" in result) {
		log.error(result);
		throw new Error("Failed to fetch data.");
	}

	const requested = new Set(names);

	for (const { count, value } of result.facet_counts?.at(0)?.counts ?? []) {
		if (requested.has(value)) byTerm.set(value, count);
	}

	return { total: result.found, byTerm };
}
