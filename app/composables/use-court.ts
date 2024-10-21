import { useQuery } from "@tanstack/vue-query";

export function useCourt(id: MaybeRef<number>) {
	const client = useApiClient();

	return useQuery({
		queryKey: ["get-document", "courts", id] as const,
		queryFn({ queryKey: [, , id] }) {
			return client.getDocument("courts", id);
		},
	});
}
