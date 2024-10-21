import { useQuery } from "@tanstack/vue-query";

export function usePlaceDetails(id: MaybeRef<number>) {
	const client = useApiClient();

	return useQuery({
		queryKey: ["get-details", "places", id] as const,
		queryFn({ queryKey: [, , id] }) {
			return client.getDetails("places", id);
		},
	});
}
