import { useQuery } from "@tanstack/vue-query";
import type { LocationQuery } from "vue-router";

import { useApiClient } from "@/composables/use-api-client";

interface UseGetFacetsParams {
	collection: string;
	facet: string;
	facetQuery?: string;
	filter_by?: string;
	max?: number;
	q?: string;
	query?: LocationQuery;
	query_by: Array<string> | string;
}

export function useGetFacets(params: MaybeRef<UseGetFacetsParams>) {
	const client = useApiClient();

	return useQuery({
		queryKey: ["get-facets", params] as const,
		async queryFn({ queryKey: [, params] }) {
			const { collection, ...query } = params;

			return client.getFacets(collection, query);
		},
	});
}
