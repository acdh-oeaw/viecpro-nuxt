import { createUrl, request } from "@acdh-oeaw/lib";
import type { SearchParams } from "typesense/lib/Typesense/Documents";
import type { LocationQuery } from "vue-router";

import { useTypesenseClient } from "@/composables/use-typesense-client";
import type { AnyDetailMap, AnyEntityMap } from "@/types/api";

type IsoDateString = string;

export interface HierarchyNode {
	group: "Institution" | "Person" | "Funktion";
	label: string;
	/** Id. */
	pk: number;
	// FIXME: Duplicates [label, group, pk].
	value: [string, string, number];
}

export interface GetAutoCompleteResponse {
	context: Array<HierarchyNode>;
}

export interface TreeEntity {
	/** Id prefixed with entity_type, e.g. `Institution_123`. */
	name: string;
	meta: {
		end: IsoDateString;
		entity_type: "Institution" | "Person" | "Funktion";
		label: string;
		/** Id. */
		pk: number;
		start: IsoDateString;
		/** Entity details. */
		url: string;
	};
	children: Array<TreeEntity>;
}

export interface GetTreeDataResponse {
	graph_type: string;
	tree_data: TreeEntity;
}

export function useApiClient() {
	const env = useRuntimeConfig();
	const client = useTypesenseClient();

	return {
		// FIXME: returns 5MB of data!
		async getAutocomplete() {
			const url = createUrl({
				baseUrl: env.public.apiBaseUrl,
				pathname: "/visualisations/entityautocomplete/",
			});

			const data = (await request(url, { responseType: "json" })) as GetAutoCompleteResponse;

			return data.context;
		},

		async getTreeData(model: string, id: string, show = "normal", direction = "down") {
			const url = createUrl({
				baseUrl: env.public.apiBaseUrl,
				pathname: `/visualisations/api/${model}/${id}/${show}/${direction}`,
			});

			const data = (await request(url, { responseType: "json" })) as GetTreeDataResponse;

			return data.tree_data;
		},

		getDetails<T extends "courts" | "institutions" | "persons" | "places">(model: T, id: number) {
			const collections = {
				courts: "viecpro_detail_court",
				institutions: "viecpro_detail_institution",
				persons: "viecpro_detail_person",
				places: "viecpro_detail_place",
			};

			const models = {
				// FIXME: typesense collection for court details uses "institution"
				// why are the model names even part of the id? they already are in separate collections
				courts: "institution",
				institutions: "institution",
				persons: "person",
				places: "place",
			};

			return client
				.collections<AnyDetailMap[T]>(collections[model])
				.documents(`detail_${models[model]}_${String(id)}`)
				.retrieve();
		},

		getDocument<
			T extends "courts" | "events" | "institutions" | "persons" | "places" | "references",
		>(collection: T, id: number) {
			const collections = {
				courts: "viecpro_courts",
				events: "viecpro_events",
				institutions: "viecpro_institutions",
				persons: "viecpro_persons",
				places: "viecpro_places",
				references: "viecpro_references",
			};

			const prefixes = {
				courts: "Hofstaat",
				events: "Event",
				institutions: "Institution",
				persons: "Person",
				places: "Place",
				references: "Reference",
			};

			return client
				.collections<AnyEntityMap[T]>(collections[collection])
				.documents(`${prefixes[collection]}_${String(id)}`)
				.retrieve();
		},

		getDocuments<
			T extends "courts" | "events" | "institutions" | "persons" | "places" | "references",
		>(collection: T, query: SearchParams) {
			const collections = {
				courts: "viecpro_courts",
				events: "viecpro_events",
				institutions: "viecpro_institutions",
				persons: "viecpro_persons",
				places: "viecpro_places",
				references: "viecpro_references",
			};

			return client.collections<AnyEntityMap[T]>(collections[collection]).documents().search(query);
		},

		getFacets<T extends "courts" | "events" | "institutions" | "persons" | "places" | "references">(
			collection: T,
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
			const collections = {
				courts: "viecpro_courts",
				events: "viecpro_events",
				institutions: "viecpro_institutions",
				persons: "viecpro_persons",
				places: "viecpro_places",
				references: "viecpro_references",
			};

			return client
				.collections<AnyEntityMap[T]>(collections[collection])
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

		// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
		getSchema<T extends "courts" | "events" | "institutions" | "persons" | "places" | "references">(
			collection: T,
		) {
			const collections = {
				courts: "viecpro_courts",
				events: "viecpro_events",
				institutions: "viecpro_institutions",
				persons: "viecpro_persons",
				places: "viecpro_places",
				references: "viecpro_references",
			};

			return client.collections<AnyEntityMap[T]>(collections[collection]).retrieve();
		},
	};
}
