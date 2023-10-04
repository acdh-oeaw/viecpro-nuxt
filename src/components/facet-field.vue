<script lang="ts" setup>
import { ChevronDown } from "lucide-vue-next";
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

defineEmits(["facetChange"]);

const route: RouteLocationNormalized = useRoute();

let facetModel: Ref<Array<string> | undefined> = ref(props.selected || []);
let loading: Ref<boolean> = ref(true);

let scopeFacet = ref({
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

	scopeFacet.value = results.facet_counts?.length !== 0 ? results.facet_counts[0] : {};

	loading.value = false;
};

onMounted(async () => {
	await loadFacets(10);
});

// add selected facet to model
const facetsWithSelected: ComputedRef<Array<object>> = computed(() => {
	let retArray = props.facets;
	return retArray;
});
</script>

<template>
	<div class="flex flex-col">
		{{ facetModel }}
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
			v-if="scopeFacet.stats?.total_values != scopeFacet.counts.length"
			class="flex cursor-pointer items-center justify-center gap-2 rounded p-1 transition hover:bg-slate-200 active:bg-slate-300"
			@click="loadFacets()"
		>
			<span>show all... ({{ scopeFacet.stats.total_values }} total)</span>
			<ChevronDown class="h-5 w-5" />
		</button>
	</div>
</template>
