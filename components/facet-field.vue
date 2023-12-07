<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="ts" setup>
import { useQuery } from "@tanstack/vue-query";
import { ChevronDown, Search, XCircle } from "lucide-vue-next";
import type { SearchResponseFacetCountSchema } from "typesense/lib/Typesense/Documents";
import { computed, type ComputedRef, type Ref, ref } from "vue";
import { type RouteLocationNormalized, useRoute } from "vue-router";

import Chip from "@/components/chip.vue";

const t = useTranslations();

const props = defineProps<{
	fieldName: string;
	facets: Array<object>;
	selected?: Array<string>;
	collection: string;
	queryBy: string;
}>();

const route: RouteLocationNormalized = useRoute();

const facetSearch: Ref<string> = ref("");
const max = ref(1);

let facetModel: Ref<Array<string> | undefined> = ref(props.selected ?? []);

let scopeFacet: Ref<SearchResponseFacetCountSchema<any> | undefined> = ref({
	field_name: props.fieldName,
	counts: [],
	stats: {},
});

const newQuery = computed(() => ({
	facet: props.fieldName,
	max: max.value,
	query: route.query,
	facetQuery: facetSearch,
	collection: props.collection,
	query_by: props.queryBy,
}));

const newResponse = useQuery({
	queryKey: ["facet", newQuery],
	queryFn: ({ queryKey }) => {
		const [, q] = queryKey;
		if (q && typeof q !== "string")
			return getFacets(q.facet, q.max, q.query, q.facetQuery, q.collection, q.query_by);
		return;
	},
});
let loading = ref(newResponse.isLoading);

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
		<div
			class="m-1 grid w-full grid-cols-[auto_1fr_auto] items-center rounded border bg-white shadow-sm"
		>
			<label :for="`${fieldName}Search`">
				<Search class="mx-2 h-4 w-4 shrink-0 text-gray-400" />
				<span class="sr-only">{{ t("ui.search-placeholder") }} facets</span>
			</label>
			<input
				:id="`${fieldName}Search`"
				v-model="facetSearch"
				type="text"
				class="p-1"
				:name="`${fieldName}Search`"
				:placeholder="t('ui.search-placeholder')"
			/>
			<button v-if="facetSearch" @click="facetSearch = ''">
				<span class="sr-only">Delete Input</span>
				<XCircle class="mx-2 h-5 w-5 text-gray-400" />
			</button>
		</div>
		<div v-if="!loading">
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
		</div>
		<button
			v-if="!loading && scopeFacet?.stats?.total_values != scopeFacet?.counts.length"
			class="flex cursor-pointer items-center justify-center gap-2 rounded p-1 transition hover:bg-slate-200 active:bg-slate-300"
			@click="max = 500"
		>
			<span>{{ t("ui.show-all") }} ({{ scopeFacet?.stats.total_values }} total)</span>
			<ChevronDown class="h-5 w-5" />
		</button>
	</div>
</template>
