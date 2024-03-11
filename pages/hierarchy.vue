<script lang="ts" setup>
import { useQuery } from "@tanstack/vue-query";

import HierarchyWrapper from "@/components/hierarchy-wrapper.vue";
import { getTreeData } from "@/lib/get-tree-data";
import type { HierarchyNode } from "@/lib/types";

const router = useRouter();
const route = useRoute();

const comQuery = computed(() => {
	const { label, id, model } = route.query;

	if (!label || !id || !model) return null;

	return {
		group: decodeURIComponent(String(model)),
		pk: Number(id),
		label: String(decodeURIComponent(String(label))),
	};
});

const autocomplete = ref<HierarchyNode | null>(comQuery.value);
const queryArgs = ref<{ show: string; direction: "down" | "up" }>({
	show: "normal",
	direction: "down",
});

const query = ref(
	useQuery({
		queryKey: ["hierarchy", comQuery, queryArgs] as const,
		queryFn: async ({ queryKey }) => {
			const [, auto, q] = queryKey;

			if (!auto) return null;

			const data = await getTreeData({
				show: q.show,
				direction: q.direction,
				model: auto.group,
				id: String(auto.pk),
			});

			return data;
		},
	}),
);

const showArgs = computed(() => {
	switch (autocomplete.value?.group) {
		case "Institution": {
			const instArgs = ["show only institutions", "add functions", "add functions and persons"];
			if (!instArgs.includes(queryArgs.value.show)) queryArgs.value.show = String(instArgs[0]);
			return instArgs;
		}
		case "Funktion": {
			const funcArgs = ["show institution hierarchy", "show amt and persons"];
			if (!funcArgs.includes(queryArgs.value.show)) queryArgs.value.show = String(funcArgs[0]);
			return funcArgs;
		}
		default: {
			queryArgs.value.show = "normal";
			return ["normal"];
		}
	}
});

definePageMeta({
	title: "pages.hierarchy.title",
});
</script>

<template>
	<MainContent class="container mx-auto">
		<div class="flex">
			<Autocomplete
				v-model="autocomplete"
				@change="
					autocomplete
						? router.push({
								query: {
									...route.query,
									id: autocomplete.pk,
									model: encodeURIComponent(autocomplete.group),
									label: encodeURIComponent(autocomplete.label),
								},
							})
						: null
				"
			/>
			<GenericListbox v-model="queryArgs.direction" :items="['down', 'up']" />
			<GenericListbox v-model="queryArgs.show" :items="showArgs" />
		</div>
		<div>
			<ClientOnly v-if="!query.isFetching">
				<HierarchyWrapper v-if="query.data" :data="query.data" />
			</ClientOnly>
			<div v-else class="animate-pulse">Loading...</div>
		</div>
	</MainContent>
</template>
