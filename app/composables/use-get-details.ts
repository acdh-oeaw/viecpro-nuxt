import { useQuery } from "@tanstack/vue-query";

import { useApiClient } from "@/composables/use-api-client";

interface UseGetDetailsParams {
	id: string;
	model: string;
}

export function useGetDetails(params: MaybeRef<UseGetDetailsParams>) {
	const client = useApiClient();

	return useQuery({
		queryKey: ["get-details", params] as const,
		async queryFn({ queryKey: [, params] }) {
			const { id, model } = params;

			return client.getDetails(model, id);
		},
	});
}
