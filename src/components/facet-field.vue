<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="ts" setup>
import { ChevronDown } from "lucide-vue-next";
import { type SearchResponseFacetCountSchema } from "typesense/lib/Typesense/Documents";
import { computed, onMounted, ref } from "vue";
import { type ComputedRef, type Ref } from "vue";
import { type RouteLocationNormalized, useRoute } from "vue-router";

import Chip from "@/components/chip.vue";
import { getFacets } from "@/composables/use-ts-data";

const props = defineProps<{
	fieldName: string;
	facets: Array<object>;
	selected?: Array<string>;
	collection: string;
	queryBy: string;
}>();

const route: RouteLocationNormalized = useRoute();

let facetModel: Ref<Array<string> | undefined> = ref(props.selected || []);
let loading: Ref<boolean> = ref(true);

let scopeFacet: Ref<SearchResponseFacetCountSchema<any> | undefined> = ref({
	field_name: props.fieldName,
	counts: [],
	stats: {},
});

const loadFacets = async (max = 500) => {
	loading.value = true;
	const results = await getFacets(
		props.fieldName,
		max,
		route.query,
		"",
		props.collection,
		props.queryBy,
	);

	scopeFacet.value = results.facet_counts ? results.facet_counts[0] : {};

	loading.value = false;
};
const addToFacets = async (name: string, max = 500) => {
	loading.value = true;
	const results = await getFacets(
		props.fieldName,
		max,
		route.query,
		name,
		props.collection,
		props.queryBy,
	);
	if (results.facet_counts) {
		scopeFacet.value?.counts.unshift(results.facet_counts[0]?.counts[0]);
	}
	loading.value = false;
};

onMounted(async () => {
	await loadFacets(10);
	if (props.selected && scopeFacet.value !== undefined) {
		props.selected.forEach((sel) => {
			if (
				!(
					scopeFacet.value?.counts.some((facet) => {
						return facet.value === sel;
					}) ?? false
				)
			) {
				addToFacets(sel);
			}
		});
	}
});

defineEmits(["facetChange"]);

// add selected facet to model
const facetsWithSelected: ComputedRef<SearchResponseFacetCountSchema<any>["counts"] | undefined> =
	computed(() => {
		let retArray = scopeFacet.value?.counts;
		return retArray;
	});
</script>

<template>
	<div class="flex flex-col">
		<h1 class="flex items-center justify-between text-2xl">
			{{ fieldName }}
		</h1>
		<div
			v-for="count in facetsWithSelected"
			:key="count.value"
			class="flex items-center gap-2 rounded p-1 transition hover:bg-slate-200 active:bg-slate-300"
		>
			<input
				:id="`${fieldName}:${count.value}`"
				v-model="facetModel"
				type="checkbox"
				class="ml-1 h-5 w-5 cursor-pointer"
				:value="count.value"
				@change="$emit('facetChange', facetModel)"
			/>
			&nbsp;
			<label
				:for="`${fieldName}:${count.value}`"
				class="flex w-full cursor-pointer items-center justify-between gap-1"
			>
				<span>
					{{ count.value }}
				</span>
				<chip v-if="count.count">
					{{ count.count }}
				</chip>
			</label>
		</div>
		<button
			v-if="scopeFacet?.stats?.total_values != scopeFacet?.counts.length"
			class="flex cursor-pointer items-center justify-center gap-2 rounded p-1 transition hover:bg-slate-200 active:bg-slate-300"
			@click="loadFacets()"
		>
			<span>show all... ({{ scopeFacet?.stats.total_values }} total)</span>
			<ChevronDown class="h-5 w-5" />
		</button>
	</div>
</template>
