import { useQuery } from "@tanstack/vue-query";

export function usePlace(id: MaybeRef<number>) {
	const client = useApiClient();

	return useQuery({
		queryKey: ["get-document", "places", id] as const,
		queryFn({ queryKey: [, , id] }) {
			return client.getDocument("places", id);
		},
	});
}
