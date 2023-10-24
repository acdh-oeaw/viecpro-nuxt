<script lang="ts" setup>
import get from "lodash.get";
import { ChevronRight, Loader2, XCircle } from "lucide-vue-next";
import { type SearchResponse } from "typesense/lib/Typesense/Documents";
import { computed, type ComputedRef, type Ref, ref, watch } from "vue";
import { type LocationQuery, type RouteLocationNormalized, useRoute } from "vue-router";

import Centered from "@/components/centered.vue";
import FacetDisclosures from "@/components/facet-disclosures.vue";
import Pagination from "@/components/pagination.vue";
import { useI18n } from "@/composables/use-i18n";
import { getDocuments } from "@/composables/use-ts-data";

const { t, locale } = useI18n();

const props = defineProps<{
	queryBy: string;
	collectionName: string;
	koi: Array<string>;
	facets?: Array<string>;
	cols?: string;
}>();

const pageLimit = 25;

const route: RouteLocationNormalized = useRoute();
const loading: Ref<boolean> = ref(true);

const input: Ref<string> = ref(route.query.q === undefined ? "" : String(route.query.q));

const docs: Ref<SearchResponse<Record<string, Document>> | null> = ref(null);

const search = async (
	collection: string,
	terms = "",
	facetQuery: string | undefined,
	page = 1,
	limit = pageLimit,
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

// TODO: finde better solution
const getDetailLink = (id: string) => {
	const type = route.path.split("/")[3];
	return `/${locale.value}/detail/${type}/${id}`;
};

const pageNum: ComputedRef<number> = computed(() => {
	return Number(route.query.page) || 1;
});
const limitNum: ComputedRef<number> = computed(() => {
	return Number(route.query.limit) || pageLimit;
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
			limitNum.value || pageLimit,
		);
	},
	{
		immediate: true,
	},
);
</script>

<template>
	<div class="grid h-full grid-cols-[4fr_2fr]">
		<div class="mx-auto flex h-full w-full max-w-container flex-col">
			<div class="my-2 grid h-12 w-full grid-cols-[1fr_auto] items-center rounded bg-white shadow">
				<label for="searchinput" class="sr-only">Search</label>
				<input
					id="searchinput"
					v-model="input"
					type="text"
					class="h-full rounded pl-2"
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
				<button
					v-if="input"
					@click="
						$router.replace({
							query: {
								...route.query,
								q: '',
								page: 1,
							},
						});
						input = '';
					"
				>
					<span class="sr-only">Delete Input</span>
					<XCircle class="mx-2 h-6 w-6 text-gray-400" />
				</button>
			</div>
			<slot />
			<Pagination
				v-if="docs != null"
				:page="docs.page"
				:limit="docs.request_params.per_page || pageLimit"
				:all="docs.found"
			/>
			<div v-if="!loading" class="w-full">
				<div class="mr-6 grid" :class="cols">
					<div v-for="key in koi" :key="key" class="m-2 font-semibold">
						{{ t(`collection-keys["${key}"]`) }}
					</div>
				</div>
				<template v-if="docs !== null">
					<div v-for="hit in docs.hits" :key="String(hit.document.id)" class="border-t py-1">
						<NuxtLink
							class="grid grid-cols-[1fr_auto] items-center text-clip rounded transition hover:bg-slate-200 active:bg-slate-300"
							:to="
								getDetailLink(
									String(hit.document.object_id || String(hit.document.id)?.replace(/\D/g, '')),
								)
							"
						>
							<div class="grid" :class="cols">
								<div
									v-for="key in koi"
									:key="key + hit.document.id"
									class="m-2 self-center overflow-auto"
								>
									{{ get(hit.document, key) }}
								</div>
							</div>
							<ChevronRight class="h-6 w-6 shrink-0" />
						</NuxtLink>
					</div>
				</template>
				<Pagination
					v-if="docs != null"
					:page="docs.page"
					:limit="docs.request_params.per_page || pageLimit"
					:all="docs.found"
				/>
			</div>
			<Centered v-else>
				<Loader2 class="h-8 w-8 animate-spin" />
			</Centered>
		</div>
		<div v-if="docs">
			<FacetDisclosures
				class="float-right m-4 w-96 max-w-full"
				:facets="docs.facet_counts"
				:loading="loading"
				:collection="collectionName"
				:query-by="queryBy"
			/>
		</div>
	</div>
</template>
