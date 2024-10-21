import { useQuery } from "@tanstack/vue-query";

export function useInstitutions(id: MaybeRef<number>) {
	const client = useApiClient();

	return useQuery({
		queryKey: ["get-document", "institutions", id] as const,
		queryFn({ queryKey: [, , id] }) {
			return client.getDocument("institutions", id);
		},
	});
}
