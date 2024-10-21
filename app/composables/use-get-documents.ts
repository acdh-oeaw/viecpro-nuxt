import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/vue-query";
import type { SearchParams } from "typesense/lib/Typesense/Documents";

import { useApiClient } from "@/composables/use-api-client";

interface UseGetDocumentsParams {
	collection: "courts" | "events" | "institutions" | "persons" | "places" | "references";
	query: SearchParams;
}

export function useGetDocuments(params: MaybeRef<UseGetDocumentsParams>) {
	const client = useApiClient();
	const queryClient = useQueryClient();

	return useQuery({
		queryKey: ["get-documents", params] as const,
		async queryFn({ queryKey: [, params] }) {
			const { collection, query } = params;

			const response = await client.getDocuments(collection, query);

			response.hits?.forEach((hit) => {
				if ("object_id" in hit.document) {
					queryClient.setQueryData(
						["get-document", { collection, id: hit.document.object_id }],
						hit.document,
					);
				}
			});

			return response;
		},
		placeholderData: keepPreviousData,
	});
}
