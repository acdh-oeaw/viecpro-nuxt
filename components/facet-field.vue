<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="ts" setup>
import { useQueries, useQuery, useQueryClient } from "@tanstack/vue-query";
import { ChevronDown, Loader2, Search, XCircle } from "lucide-vue-next";
import type { SearchResponseFacetCountSchema } from "typesense/lib/Typesense/Documents";
import { computed, type ComputedRef, type Ref, ref } from "vue";
import { type RouteLocationNormalized, useRoute } from "vue-router";

import Chip from "@/components/chip.vue";
import type { LocationQuery } from "#vue-router";

defineEmits(["facetChange"]);
const t = useTranslations();
const queryClient = useQueryClient();
const route: RouteLocationNormalized = useRoute();

const props = defineProps<{
	fieldName: string;
	facets: Array<object>;
	selected?: Array<string>;
	collection: string;
	queryBy: Array<string> | string;
}>();

const facetSearch: Ref<string> = ref("");
const max = ref(10);

let facetModel: Ref<Array<string>> = ref(props.selected ?? []);

const selectionQueries = useQueries({
	queries: computed(() =>
		props.selected
			? props.selected.map((selection) => {
					interface QueryObject {
						facet: string;
						max: number;
						query: LocationQuery;
						facetQuery: string;
						collection: string;
						query_by: Array<string> | string;
					}
					const query: QueryObject = {
						facet: props.fieldName,
						max: 10, // In case one filter matches another perfectly
						query: route.query,
						facetQuery: selection,
						collection: props.collection,
						query_by: props.queryBy,
					};
					return {
						queryKey: ["single facet", query] as const,
						queryFn: async ({ queryKey }: { queryKey: [string, QueryObject] }) => {
							const [, q] = queryKey;

							const result = await getFacets(
								q.facet,
								q.max,
								q.query,
								q.facetQuery,
								q.collection,
								q.query_by,
							);

							if (result.facet_counts?.[0]?.counts) {
								return result.facet_counts[0]?.counts.filter(
									(facet) => facet.value === q.facetQuery,
								)[0];
							}
							return { count: 0, highlighted: "", value: "" };
						},
					};
				})
			: [],
	),
});

const query = computed(() => ({
	facet: props.fieldName,
	max: max.value,
	query: route.query,
	facetQuery: facetSearch,
	collection: props.collection,
	query_by: props.queryBy,
}));

const facetResponse = useQuery({
	queryKey: ["facet", query] as const,
	queryFn: async ({ queryKey }) => {
		const [, q] = queryKey;
		const results = await getFacets(
			q.facet,
			q.max,
			q.query,
			q.facetQuery,
			q.collection,
			q.query_by,
		);
		if (results.facet_counts === undefined) return;
		else {
			results.facet_counts[0]?.counts.forEach((count) => {
				queryClient.setQueryData(
					["single facet", { ...q, max: 10, facetQuery: count.value }],
					count,
				);
			});

			return results.facet_counts[0];
		}
	},
});

const loading = computed(
	() =>
		facetResponse.isFetching.value ||
		selectionQueries.value.some((selectionQuery) => selectionQuery.isFetching),
);

// add selected facets to model
const facetsWithSelected: ComputedRef<SearchResponseFacetCountSchema<any>["counts"]> = computed(
	() => {
		if (loading.value) return [];

		const retArray: SearchResponseFacetCountSchema<any>["counts"] = [];

		if (selectionQueries.value.length !== 0) {
			retArray.push(
				...(selectionQueries.value
					.map((selects) => selects.data)
					.sort(
						(a, b) => (b?.count ?? 0) - (a?.count ?? 0),
					) as SearchResponseFacetCountSchema<any>["counts"]),
			);
		}
		if (facetResponse.data.value) {
			retArray.push(
				...facetResponse.data.value.counts
					.filter((count) => !props.selected?.includes(count.value))
					.sort((a, b) => b.count - a.count),
			);
		}
		return retArray;
	},
);
</script>

<template>
	<div class="flex flex-col">
		<h1 class="flex cursor-auto items-center justify-between text-2xl">
			{{ t(`collection-keys["${collection}"]["${fieldName}"]`) }}
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
					data-testid="facetInput"
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
		<Centered v-else class="h-16">
			<Loader2 class="h-5 w-5 animate-spin" />
		</Centered>
		<button
			v-if="
				!loading &&
				facetResponse.data.value?.stats?.total_values != facetResponse.data.value?.counts.length
			"
			class="flex cursor-pointer items-center justify-center gap-2 rounded p-1 transition hover:bg-slate-200 active:bg-slate-300"
			:class="facetResponse.isRefetching.value && 'animate-pulse'"
			@click="max = 400"
		>
			<span>{{ t("ui.show-all") }} ({{ facetResponse.data.value?.stats.total_values }} total)</span>
			<ChevronDown class="h-5 w-5" />
		</button>
	</div>
</template>
@/lib/helpers.c
