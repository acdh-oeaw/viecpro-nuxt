<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="ts" setup>
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { ChevronDown, Loader2, Search, XCircle } from "lucide-vue-next";
import type { SearchResponseFacetCountSchema } from "typesense/lib/Typesense/Documents";
import { computed, type ComputedRef, type Ref, ref } from "vue";
import { type RouteLocationNormalized, useRoute } from "vue-router";

import Chip from "@/components/chip.vue";
import { removeDuplicates } from "@/lib/helpers";

const t = useTranslations();
const queryClient = useQueryClient();

const props = defineProps<{
	fieldName: string;
	facets: Array<object>;
	selected?: Array<string>;
	collection: string;
	queryBy: string;
}>();

const route: RouteLocationNormalized = useRoute();

const facetSearch: Ref<string> = ref("");
const max = ref(10);

let facetModel: Ref<Array<string>> = ref(props.selected ?? []);

const selectionQuery = !props.selected
	? null
	: props.selected.map((selection) => {
			const query = {
				facet: props.fieldName,
				max: 1,
				query: route.query,
				facetQuery: selection,
				collection: props.collection,
				query_by: props.queryBy,
			};
			return useQuery({
				queryKey: ["single facet", query] as const,
				queryFn: async ({ queryKey }) => {
					const [, q] = queryKey;
					const result = await getFacets(
						q.facet,
						q.max,
						q.query,
						q.facetQuery,
						q.collection,
						q.query_by,
					);
					if (result.facet_counts) return result.facet_counts[0]?.counts[0];
					return;
				},
			});
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
	queryFn: async ({ queryKey }) => {
		const [, q] = queryKey;
		if (q && typeof q !== "string") {
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
						["single facet", { ...q, max: 1, facetQuery: count.value }],
						count,
					);
				});
				return results.facet_counts[0];
			}
		}
		return;
	},
});

const loading = computed(
	() =>
		newResponse.isLoading.value ||
		selectionQuery?.some((selectionQuery) => selectionQuery.isLoading.value),
);

defineEmits(["facetChange"]);

// add selected facets to model
const facetsWithSelected: ComputedRef<SearchResponseFacetCountSchema<any>["counts"]> = computed(
	() => {
		let retArray: SearchResponseFacetCountSchema<any>["counts"] = [];
		if (!loading.value && newResponse.data.value) {
			retArray = [...retArray, ...newResponse.data.value.counts];
		}
		if (selectionQuery) {
			retArray = [
				...retArray,
				...(selectionQuery.map(
					(selects) => selects.data.value,
				) as SearchResponseFacetCountSchema<any>["counts"]),
			];
		}
		return removeDuplicates(
			retArray
				.sort((a, b) => {
					return b.count - a.count;
				})
				.sort((a) => {
					if (facetModel.value.includes(a.value)) return -10;
					return 0;
				}),
			"value",
		) as SearchResponseFacetCountSchema<any>["counts"];
	},
);
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
		<Centered v-else class="h-16">
			<Loader2 class="h-5 w-5 animate-spin" />
		</Centered>
		<button
			v-if="
				!loading &&
				newResponse.data.value?.stats?.total_values != newResponse.data.value?.counts.length
			"
			class="flex cursor-pointer items-center justify-center gap-2 rounded p-1 transition hover:bg-slate-200 active:bg-slate-300"
			:class="newResponse.isRefetching.value && 'animate-pulse'"
			@click="max = 500"
		>
			<span>{{ t("ui.show-all") }} ({{ newResponse.data.value?.stats.total_values }} total)</span>
			<ChevronDown class="h-5 w-5" />
		</button>
	</div>
</template>
@/lib/helpers.c
