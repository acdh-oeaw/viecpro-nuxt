<script lang="ts" setup>
import { useQuery } from "@tanstack/vue-query";

import HierarchyWrapper from "@/components/hierarchy-wrapper.vue";
import { getTreeData } from "@/lib/get-tree-data";
import type { HierarchyNode } from "@/lib/types";

const router = useRouter();
const route = useRoute();

const comQuery = computed(() => {
	const { label, id, model } = route.query;
	console.log("YOLO", route.query);

	if (!label || !id || !model) return null;
	console.log(route.query);

	return {
		group: decodeURIComponent(String(model)),
		pk: Number(id),
		label: String(decodeURIComponent(String(label))),
	};
});

const autocomplete = ref<HierarchyNode | null>(comQuery.value);
const queryArgs = ref<{ show: string; mode: "down" | "up" }>({ show: "normal", mode: "down" });

const query = ref(
	useQuery({
		queryKey: ["hierarchy", comQuery, queryArgs] as const,
		queryFn: async ({ queryKey }) => {
			const [, auto, q] = queryKey;

			if (!auto) return null;

			const data = await getTreeData({
				show: q.show,
				mode: q.mode,
				model: auto.group,
				id: String(auto.pk),
			});

			return data;
		},
	}),
);

definePageMeta({
	title: "pages.hierarchy.title",
});
</script>

<template>
	<MainContent class="container mx-auto">
		<div class="flex flex-col">
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
		</div>
		<div>
			<ClientOnly v-if="!query.isFetching">
				<HierarchyWrapper v-if="query.data" :data="query.data" />
			</ClientOnly>
			<div v-else class="animate-pulse">Loading...</div>

			<div>
				<h1>show</h1>
				<div>
					<input id="normal" v-model="queryArgs.show" value="normal" type="radio" name="id" />
					<label for="normal">normal</label>
				</div>
				<div>
					<input
						id="show%20only%20institutions"
						v-model="queryArgs.show"
						value="show%20only%20institutions"
						type="radio"
						name="id"
					/>
					<label for="show%20only%20institutions">show only institutions</label>
				</div>
				<div>
					<input
						id="add%20functions"
						v-model="queryArgs.show"
						value="add%20functions"
						type="radio"
						name="id"
					/>
					<label for="add%20functions">add functions</label>
				</div>
				<div>
					<input
						id="show%20institution%20hierarchy"
						v-model="queryArgs.show"
						value="show%20institution%20hierarchy"
						type="radio"
						name="id"
					/>
					<label for="show%20institution%20hierarchy">show institution hierarchy</label>
				</div>
			</div>
			<pre>
				{{ queryArgs }}
			</pre
			>
		</div>
	</MainContent>
</template>
