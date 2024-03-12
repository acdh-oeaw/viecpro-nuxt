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

const comOptions = computed<{ show: string; direction: "down" | "up" }>(() => {
	const { direction, mode } = route.query;
	return {
		direction: String(direction ?? "down") as "down" | "up",
		show: String(mode ?? "normal"),
	};
});

const autocomplete = ref<HierarchyNode | null>(comQuery.value);
const options = ref<{ show: string; direction: "down" | "up" }>(comOptions.value);

const query = ref(
	useQuery({
		queryKey: ["hierarchy", comQuery, comOptions] as const,
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
			if (!instArgs.includes(options.value.show)) options.value.show = String(instArgs[0]);
			return instArgs;
		}
		case "Funktion": {
			const funcArgs = ["show institution hierarchy", "show amt and persons"];
			if (!funcArgs.includes(options.value.show)) options.value.show = String(funcArgs[0]);
			return funcArgs;
		}
		default: {
			options.value.show = "normal";
			return ["normal"];
		}
	}
});

definePageMeta({
	title: "pages.hierarchy.title",
});
</script>

<template>
	<MainContent class="container mx-auto grid grid-flow-row grid-rows-[auto_1fr]">
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
			<ClientOnly>
				<GenericListbox
					v-model="options.direction"
					:items="['down', 'up']"
					@change="
						(direction) => {
							console.log(direction);
							router.push({ query: { ...route.query, direction } });
						}
					"
				/>
				<GenericListbox
					v-model="options.show"
					:items="showArgs"
					@change="(mode) => router.push({ query: { ...route.query, mode } })"
				/>
			</ClientOnly>
		</div>
		<div>
			<ClientOnly v-if="!query.isFetching">
				<VisContainer v-slot="{ width }" class="my-4 flex items-center">
					<HierarchyWrapper v-if="query.data" :data="query.data" :width="width" />
				</VisContainer>
			</ClientOnly>
			<div v-else class="animate-pulse">Loading...</div>
		</div>
	</MainContent>
</template>
