import { useQuery } from "@tanstack/vue-query";

import { useApiClient } from "@/composables/use-api-client";

interface UseGetSchemaParams {
	collection: string;
}

export function useGetSchema(params: MaybeRef<UseGetSchemaParams>) {
	const client = useApiClient();

	return useQuery({
		queryKey: ["get-schema", params] as const,
		async queryFn({ queryKey: [, params] }) {
			const { collection } = params;

			return client.getSchema(collection);
		},
	});
}
