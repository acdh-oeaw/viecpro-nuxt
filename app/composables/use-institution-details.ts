import { useQuery } from "@tanstack/vue-query";

export function useInstitutionDetails(id: MaybeRef<number>) {
	const client = useApiClient();

	return useQuery({
		queryKey: ["get-details", "institutions", id] as const,
		queryFn({ queryKey: [, , id] }) {
			return client.getDetails("institutions", id);
		},
	});
}
