import { useQuery } from "@tanstack/vue-query";

interface UseHierarchyParams {
	auto: { group: string; pk: number; label: string } | null;
	direction: string;
	show: string | undefined;
}

export function useHierarchy(params: MaybeRef<UseHierarchyParams>) {
	const client = useApiClient();

	return useQuery({
		queryKey: ["hierarchy", params] as const,
		async queryFn({ queryKey: [, params] }) {
			const { auto, direction, show } = params;

			if (!auto) return null;

			const data = await client.getTreeData(
				auto.group,
				String(auto.pk),
				String(show),
				String(direction),
			);

			return data;
		},
	});
}
