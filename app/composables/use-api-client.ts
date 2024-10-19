import { createUrl, request } from "@acdh-oeaw/lib";
import type { SearchParams } from "typesense/lib/Typesense/Documents";
import type { LocationQuery } from "vue-router";

import { useTypesenseClient } from "@/composables/use-typesense-client";
import type { HierarchyNode } from "@/lib/types";

export interface TreeEntity {
	name: string;
	meta: {
		end: string;
		entity_type: string;
		label: string;
		pk: number;
		start: string;
		url: string;
	};
	children?: Array<TreeEntity>;
}

export function useApiClient() {
	const env = useRuntimeConfig();
	const client = useTypesenseClient();

	return {
		async getAutocomplete() {
			const url = createUrl({
				baseUrl: env.public.apiBaseUrl,
				pathname: "/visualisations/entityautocomplete/",
			});

			const data = (await request(url, { responseType: "json" })) as {
				context: Array<HierarchyNode>;
			};

			return data.context;
		},
		async getTreeData(model: string, id: string, show = "normal", direction = "down") {
			const url = createUrl({
				baseUrl: env.public.apiBaseUrl,
				pathname: `/visualisations/api/${model}/${id}/${show}/${direction}`,
			});

			const data = (await request(url, { responseType: "json" })) as { tree_data: TreeEntity };

			return data.tree_data;
		},

		getDetails(model: string, id: string, idName?: string) {
			return client
				.collections(`viecpro_detail_${model}`)
				.documents(`detail_${idName ?? model}_${id}`)
				.retrieve();
		},
		getDocument(collection: string, id: string) {
			return client.collections(collection).documents(id).retrieve();
		},
		getDocuments(collection: string, query: SearchParams) {
			return client.collections(collection).documents().search(query);
		},
		getFacets(
			collection: string,
			{
				facet,
				max = 500,
				query = {},
				facetQuery = "",
				query_by,
				q = "*",
				filter_by = "",
			}: {
				facet: string;
				facetQuery?: string;
				filter_by?: string;
				max?: number;
				q?: string;
				query?: LocationQuery;
				query_by: Array<string> | string;
			},
		) {
			return client
				.collections(collection)
				.documents()
				.search({
					q,
					per_page: 0,
					query_by,
					...query,
					facet_by: facet,
					facet_query: `${facet}:${facetQuery}`,
					max_facet_values: max,
					filter_by,
				});
		},
		getSchema(collection: string) {
			return client.collections(collection).retrieve();
		},
	};
}
