import { useQuery } from "@tanstack/vue-query";

export function useAutoComplete() {
	const client = useApiClient();

	return useQuery({
		queryKey: ["autocomplete"],
		queryFn() {
			return client.getAutocomplete();
		},
	});
}
