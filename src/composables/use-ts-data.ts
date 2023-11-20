import { type CollectionSchema } from "typesense/lib/Typesense/Collection";
import { type SearchParams, type SearchResponse } from "typesense/lib/Typesense/Documents";
import { type LocationQuery } from "vue-router";

import { useDefaultClient } from "@/lib/get-ts-data";
import { type AnyEntity, type Relation } from "@/lib/schema.types";

export async function getDocuments<CollectionEntry extends AnyEntity>(
	query: SearchParams,
	collection: string,
): Promise<SearchResponse<CollectionEntry>> {
	return useDefaultClient().collections<CollectionEntry>(collection).documents().search(query);
}

export async function getDocument<CollectionEntry extends AnyEntity>(
	collection: string,
	id: string,
): Promise<AnyEntity> {
	return useDefaultClient().collections<CollectionEntry>(collection).documents(id).retrieve();
}

export async function getFacets<CollectionEntry extends AnyEntity>(
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

export async function getRelations<CollectionEntry extends Relation>(
	sourceId: string,
	query_by: string,
	kind?: string,
): Promise<SearchResponse<CollectionEntry>> {
	const query: SearchParams = { q: sourceId, query_by };
	if (kind != null) query.filter_by = `target.model := ${kind} || source.model := ${kind}`;
	return getDocuments(query, `viecpro_relations`);
}

export async function getDocumentAndRelations(
	prefix: string,
	collection: string,
	id: string,
	kind?: string,
): Promise<{
	entity: AnyEntity;
	source: SearchResponse<Relation>;
	target: SearchResponse<Relation>;
}> {
	const [entity, source, target] = await Promise.all([
		getDocument(collection, prefix + id),
		getRelations(id, "source.object_id", kind),
		getRelations(id, "target.object_id", kind),
	]);
	return { entity, source, target };
}

// Might be useful somedays
export async function getCollections(): Promise<Array<CollectionSchema>> {
	return useDefaultClient().collections().retrieve();
}
