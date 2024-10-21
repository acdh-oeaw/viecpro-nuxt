import { useQuery } from "@tanstack/vue-query";

export function useReferences(id: MaybeRef<number>) {
	const client = useApiClient();

	return useQuery({
		queryKey: ["get-documents", "references", id] as const,
		queryFn({ queryKey: [, , id] }) {
			return client.getDocuments("references", {
				q: "*",
				query_by: "shortTitle",
				filter_by: `related_doc.object_id:=${String(id)} && related_doc.model:=Institution`,
				per_page: 250,
			});
		},
	});
}
