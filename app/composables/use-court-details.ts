import { useQuery } from "@tanstack/vue-query";

export function useCourtDetails(id: MaybeRef<number>) {
	const client = useApiClient();

	return useQuery({
		queryKey: ["get-details", "courts", id] as const,
		queryFn({ queryKey: [, , id] }) {
			return client.getDetails("courts", id);
		},
	});
}
