import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import type { SearchParams } from "typesense/lib/Typesense/Documents";

import { useApiClient } from "@/composables/use-api-client";

interface UseGetDocumentsParams {
	collection: string;
	query: SearchParams;
}

export function useGetDocuments(params: MaybeRef<UseGetDocumentsParams>) {
	const client = useApiClient();
	// const queryClient = useQueryClient();

	return useQuery({
		queryKey: ["get-documents", params] as const,
		async queryFn({ queryKey: [, params] }) {
			const { collection, query } = params;

			const response = await client.getDocuments(collection, query);

			// TODO:
			// if (response.hits) {
			// 	response.hits.forEach((hit) => {
			// 		queryClient.setQueryData(
			// 			[collection, String(hit.document.object_id)],
			// 			hit.document,
			// 		);
			// 	});
			// }

			return response;
		},
		placeholderData: keepPreviousData,
	});
}
