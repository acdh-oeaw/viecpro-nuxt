import { useQuery } from "@tanstack/vue-query";

export function usePersonDetails(id: MaybeRef<number>) {
	const client = useApiClient();

	return useQuery({
		queryKey: ["get-details", "persons", id] as const,
		queryFn({ queryKey: [, , id] }) {
			return client.getDetails("persons", id);
		},
	});
}
