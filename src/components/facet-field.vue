<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="ts" setup>
import { ChevronDown, XCircle } from "lucide-vue-next";
import { type SearchResponseFacetCountSchema } from "typesense/lib/Typesense/Documents";
import { computed, onMounted, ref } from "vue";
import { type ComputedRef, type Ref } from "vue";
import { type RouteLocationNormalized, useRoute } from "vue-router";

import Chip from "@/components/chip.vue";
import { useI18n } from "@/composables/use-i18n";
import { getFacets } from "@/composables/use-ts-data";

const { t } = useI18n();

const props = defineProps<{
	fieldName: string;
	facets: Array<object>;
	selected?: Array<string>;
	collection: string;
	queryBy: string;
}>();

const route: RouteLocationNormalized = useRoute();

const facetSearch: Ref<string> = ref("");

let facetModel: Ref<Array<string> | undefined> = ref(props.selected || []);
let loading: Ref<boolean> = ref(true);

let scopeFacet: Ref<SearchResponseFacetCountSchema<any> | undefined> = ref({
	field_name: props.fieldName,
	counts: [],
	stats: {},
});

const loadFacets = async (max = 500, query = "") => {
	loading.value = true;
	const results = await getFacets(
		props.fieldName,
		max,
		route.query,
		query,
		props.collection,
		props.queryBy,
	);

	scopeFacet.value = results.facet_counts ? results.facet_counts[0] : {};

	loading.value = false;
};
const addToFacets = async (name: string, max = 1) => {
	loading.value = true;
	const results = await getFacets(
		props.fieldName,
		max,
		route.query,
		name,
		props.collection,
		props.queryBy,
	);
	if (results.facet_counts && scopeFacet.value) {
		scopeFacet.value.counts.unshift(results.facet_counts[0]?.counts[0]);
	}
	loading.value = false;
};

const addSelected = async (selected: Array<string>) => {
	selected.forEach((sel) => {
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
};

const facetSearchInput = async (input: string) => {
	await loadFacets(10, input);
	if (props.selected && scopeFacet.value !== undefined) addSelected(props.selected);
};

onMounted(async () => {
	await loadFacets(10);
	if (props.selected && scopeFacet.value !== undefined) {
		addSelected(props.selected);
	}
});

defineEmits(["facetChange"]);

// add selected facet to model
const facetsWithSelected: ComputedRef<SearchResponseFacetCountSchema<any>["counts"] | undefined> =
	computed(() => {
		const retArray = scopeFacet.value?.counts;
		return retArray
			?.sort((a, b) => {
				return b.count - a.count;
			})
			.sort((a) => {
				if (facetModel.value?.includes(a.value) ?? false) return -1;
				return 0;
			});
	});
</script>

<template>
	<div class="flex flex-col">
		<h1 class="flex items-center justify-between text-2xl">
			{{ t(`collection-keys["${fieldName}"]`) }}
		</h1>

		<div class="m-1 grid w-full grid-cols-[1fr_auto] items-center rounded bg-white shadow-sm">
			<label :for="`${fieldName}Search`" class="sr-only">Search through facets</label>
			<input
				:id="`${fieldName}Search`"
				v-model="facetSearch"
				type="text"
				class="rounded p-1"
				:name="`${fieldName}Search`"
				:placeholder="t('ui.search-placeholder')"
				@input="facetSearchInput(facetSearch)"
			/>
			<button v-if="facetSearch" @click="(facetSearch = ''), loadFacets(10)">
				<span class="sr-only">Delete Input</span>
				<XCircle class="mx-2 h-6 w-6 text-gray-400" />
			</button>
		</div>
		<div
			v-for="count in facetsWithSelected"
			:key="count.value"
			class="flex items-center gap-2 rounded p-1 py-1.5 transition hover:bg-slate-200 active:bg-slate-300"
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
				<Chip v-if="count.count" class="mx-1">
					{{ count.count }}
				</Chip>
			</label>
		</div>
		<button
			v-if="scopeFacet?.stats?.total_values != scopeFacet?.counts.length"
			class="flex cursor-pointer items-center justify-center gap-2 rounded p-1 transition hover:bg-slate-200 active:bg-slate-300"
			@click="loadFacets()"
		>
			<span>{{ t("ui.show-all") }} ({{ scopeFacet?.stats.total_values }} total)</span>
			<ChevronDown class="h-5 w-5" />
		</button>
	</div>
</template>
