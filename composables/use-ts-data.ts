import type { CollectionSchema } from "typesense/lib/Typesense/Collection";
import type { SearchParams, SearchResponse } from "typesense/lib/Typesense/Documents";
import type { LocationQuery } from "vue-router";

import { useDefaultClient } from "@/lib/get-ts-data";
import type { AnyDetail, AnyEntity } from "@/types/schema";

export async function getDocuments<T extends AnyEntity>(
	query: SearchParams,
	collection: string,
): Promise<SearchResponse<T>> {
	return useDefaultClient().collections<T>(collection).documents().search(query);
}

export async function getDocument<T extends AnyEntity>(collection: string, id: string): Promise<T> {
	return useDefaultClient().collections<T>(collection).documents(id).retrieve();
}

export async function getFacets<T extends AnyEntity>(
	facet: string,
	max = 500,
	query: LocationQuery = {},
	facetQuery = "",
	collection: string,
	query_by: string,
	q = "*",
): Promise<SearchResponse<T>> {
	return useDefaultClient()
		.collections<T>(collection)
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

export async function getDetails<T extends AnyDetail>(model: string, id: string): Promise<T> {
	return useDefaultClient()
		.collections<T>(`viecpro_detail_${model}`)
		.documents(`detail_${model}_${id}`)
		.retrieve();
}

// Might be useful somedays
export async function getCollections(): Promise<Array<CollectionSchema>> {
	return useDefaultClient().collections().retrieve();
}