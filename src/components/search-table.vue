<script lang="ts" setup>
import { ChevronUp } from "lucide-vue-next";
import { type SearchResponse } from "typesense/lib/Typesense/Documents";
import { computed, type ComputedRef, type Ref, ref, watch } from "vue";
import { type LocationQuery, type RouteLocationNormalized, useRoute } from "vue-router";

import FacetDisclosures from "@/components/facet-disclosures.vue";
import { useI18n } from "@/composables/use-i18n";
import { getDocuments } from "@/composables/use-ts-data";

const { t } = useI18n();

const props = defineProps<{
	queryBy: string;
	collectionName: string;
	koi: Array<string>;
	facets?: Array<string>;
}>();

const route: RouteLocationNormalized = useRoute();
const loading: Ref<boolean> = ref(true);

const input: Ref<string> = ref(route.query.q === undefined ? "" : String(route.query.q));

const docs: Ref<SearchResponse<Record<string, Document>> | null> = ref(null);

const search = async (
	collection: string,
	terms = "",
	facetQuery: string | undefined,
	page = 1,
	limit = 10,
) => {
	loading.value = true;

	const response = await getDocuments(
		{
			q: terms,
			query_by: props.queryBy,
			per_page: limit,
			page,
			facet_by: props.facets ? props.facets.join(",") : "",
			filter_by: facetQuery ?? "",
			// max_facet_values: 500,
		},
		collection,
	);

	docs.value = response;
	loading.value = false;
};

const pageNum: ComputedRef<number> = computed(() => {
	return Number(route.query.page) || 1;
});
const limitNum: ComputedRef<number> = computed(() => {
	return Number(route.query.limit) || 10;
});

watch(
	route,
	(newRoute) => {
		const query: LocationQuery = newRoute.query;

		search(
			props.collectionName,
			String(query.q === undefined ? "" : query.q),
			query.facets,
			pageNum.value,
			limitNum.value || 10,
		);
	},
	{
		immediate: true,
	},
);
</script>

<template>
	<div class="grid grid-cols-[4fr_2fr]">
		<div class="mx-auto flex max-w-container flex-col">
			<div>
				<label for="searchinput" class="sr-only">Search</label>
				<input
					id="searchinput"
					v-model="input"
					type="text"
					class="my-2 h-12 w-full rounded p-2 shadow"
					placeholder="Search..."
					@input="
						$router.replace({
							query: {
								...route.query,
								q: input,
								page: 1,
							},
						})
					"
				/>
			</div>
			<slot />
			<div class="grid" :style="`grid-template-columns: repeat(${koi.length}, minmax(0, 1fr))`">
				<div v-for="key in koi" :key="key" class="m-2">
					{{ t(`collection-keys["${key}"]`) }}
				</div>
				<template v-if="docs !== null">
					<template v-for="hit in docs.hits" :key="hit.document.id">
						<div class="border-t" :style="`grid-column: span ${koi.length} / span ${koi.length}`" />
						<div v-for="key in koi" :key="key + hit.document.id" class="m-2 self-center">
							{{ hit.document[key] }}
						</div>
					</template>
				</template>
			</div>
			<div v-if="docs !== null" class="flex items-center justify-between">
				<NuxtLink
					v-if="pageNum > 1"
					:to="{
						query: {
							...route.query,
							page: pageNum - 1,
						},
					}"
				>
					<div
						class="cursor-pointer rounded border p-2 transition hover:bg-slate-200 active:bg-slate-300"
					>
						<ChevronUp class="h-5 w-5 -rotate-90" />
						<span class="sr-only">Previous Page</span>
					</div>
				</NuxtLink>
				<div v-else class="cursor-not-allowed rounded border p-2 text-gray-400 transition">
					<ChevronUp class="h-5 w-5 -rotate-90" />
					<span class="sr-only">Previous Page, but you're already on page 1</span>
				</div>
				<div>
					showing {{ (docs.page - 1) * (docs.request_params.per_page || 10) + 1 }} -
					{{ Math.min(docs.page * (docs.request_params.per_page || 10), docs.found) }} out of
					{{ docs.found }}
				</div>
				<NuxtLink
					v-if="pageNum * limitNum < Number(docs.found)"
					:to="{
						query: {
							...route.query,
							page: pageNum + 1,
						},
					}"
				>
					<div
						class="cursor-pointer rounded border p-2 transition hover:bg-slate-200 active:bg-slate-300"
					>
						<ChevronUp class="h-5 w-5 rotate-90" />
						<span class="sr-only">Next Page</span>
					</div>
				</NuxtLink>

				<div v-else class="cursor-not-allowed rounded border p-2 transition">
					<ChevronUp class="h-5 w-5 rotate-90 text-gray-400" />
					<span class="sr-only">Next Page, but you're already on the last page</span>
				</div>
			</div>
		</div>
		<div v-if="docs">
			<FacetDisclosures
				class="float-right m-4 max-w-sm"
				:facets="docs.facet_counts"
				:loading="loading"
				:collection="collectionName"
				:query-by="queryBy"
			/>
		</div>
	</div>
</template>
