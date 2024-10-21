import { useQuery } from "@tanstack/vue-query";

export function usePerson(id: MaybeRef<number>) {
	const client = useApiClient();

	return useQuery({
		queryKey: ["get-document", "persons", id] as const,
		queryFn({ queryKey: [, , id] }) {
			return client.getDocument("persons", id);
		},
	});
}
