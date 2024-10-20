import { useQuery } from "@tanstack/vue-query";

import { useApiClient } from "@/composables/use-api-client";

interface UseGetDocumentParams {
	collection: string;
	id: string;
}

export function useGetDocument(params: MaybeRef<UseGetDocumentParams>) {
	const client = useApiClient();

	return useQuery({
		queryKey: ["get-document", params] as const,
		async queryFn({ queryKey: [, params] }) {
			const { collection, id } = params;

			return client.getDocument(collection, id);
		},
	});
}
