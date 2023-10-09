import { type SearchParams, type SearchResponse } from "typesense/lib/Typesense/Documents";
import { type LocationQuery } from "vue-router";

import { useDefaultClient } from "@/lib/get-ts-data";

export async function getDocuments<CollectionEntry extends Record<string, Document>>(
	query: SearchParams,
	collection: string,
): Promise<SearchResponse<CollectionEntry>> {
	return useDefaultClient().collections<CollectionEntry>(collection).documents().search(query);
}

export async function getFacets<CollectionEntry extends Record<string, Document>>(
	facet: string,
	max = 500,
	query: LocationQuery = {},
	facetQuery = "",
	collection: string,
	query_by: string,
	q = "*",
): Promise<SearchResponse<CollectionEntry>> {
	return useDefaultClient()
		.collections<CollectionEntry>(collection)
		.documents()
		.search({
			q,
			per_page: 0,
			query_by,
			...query,
			facet_by: facet,
			facet_query: `${facet}:${facetQuery}`,
			max_facet_values: max,
		});
}