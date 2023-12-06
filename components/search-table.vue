<script lang="ts" setup>
import { useQuery, useQueryClient, type UseQueryReturnType } from "@tanstack/vue-query";
import { useWindowSize } from "@vueuse/core";
import get from "lodash.get";
import { ChevronRight, Loader2, Search, XCircle } from "lucide-vue-next";
import type { SearchResponse } from "typesense/lib/Typesense/Documents";
import { computed, type ComputedRef, type Ref, ref, watch } from "vue";
import { type LocationQuery, type RouteLocationNormalized, useRoute } from "vue-router";

import type { AnyEntity } from "@/types/schema";

const locale = useLocale();
const t = useTranslations();
const queryClient = useQueryClient();

const props = defineProps<{
	queryBy: string;
	collectionName: string;
	koi: Array<string>;
	facets?: Array<string>;
	cols?: string;
	sort?: Array<string>;
}>();

const pageLimit = 25;

const route: RouteLocationNormalized = useRoute();

const input = ref(route.query.q === undefined ? "" : String(route.query.q));

const docs: Ref<UseQueryReturnType<SearchResponse<AnyEntity>, object> | null> = ref(null);
const loading = computed(
	() =>
		docs.value === null ||
		docs.value.isLoading.value ||
		docs.value.isFetching.value ||
		docs.value.isPending.value ||
		docs.value.isRefetching,
);

const windowWidth = useWindowSize().width;

const search = (
	collection: string,
	terms = "",
	facetQuery: string | undefined,
	page = 1,
	limit = pageLimit,
	sortBy = "",
) => {
	const query = {
		q: terms,
		query_by: props.queryBy,
		per_page: limit,
		page,
		facet_by: props.facets ? props.facets.join(",") : "",
		filter_by: facetQuery ?? "",
		sort_by: sortBy,
		// max_facet_values: 500,
	};

	const response = useQuery({
		queryKey: ["search", collection, JSON.stringify(query)] as const,
		queryFn: async () => {
			const response = await getDocuments(query, collection);
			if (response.hits) {
				response.hits.forEach((hit) => {
					queryClient.setQueryData(
						[props.collectionName, String(hit.document.object_id)],
						hit.document,
					);
				});
			}
			return response;
		},
	});

	docs.value = response;
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
	(newRoute, oldRoute) => {
		const query: LocationQuery = newRoute.query;
		if (!oldRoute || String(newRoute.name) !== String(oldRoute.name)) {
			search(
				props.collectionName,
				String(query.q ?? ""),
				String(query.facets ?? ""),
				pageNum.value,
				limitNum.value || pageLimit,
				String(query.sort ?? ""),
			);
		}
	},
	{
		immediate: true,
	},
);
</script>

<template>
	<div class="mx-2 flex h-full flex-col-reverse gap-4 xl:grid xl:grid-cols-[4fr_2fr]">
		<div class="mx-auto flex h-full w-full max-w-container flex-col p-2 xl:p-0">
			<div
				class="mb-4 grid h-12 w-full shrink-0 grid-cols-[auto_1fr_auto] items-center rounded border bg-white shadow-md xl:my-4"
			>
				<label for="searchinput">
					<Search class="mx-3 h-5 w-5 shrink-0 text-gray-400" />
					<span class="sr-only">
						{{ t("ui.search-placeholder") }}
					</span>
				</label>
				<input
					id="searchinput"
					v-model="input"
					type="text"
					class="h-full rounded"
					:placeholder="t('ui.search-placeholder')"
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
				v-if="docs != null && docs.data"
				:page="docs.data.page"
				:limit="docs.data.request_params.per_page || pageLimit"
				:all="docs.data.found"
			/>
			<div v-if="!loading && docs?.data" class="w-full">
				<div class="mr-6 hidden md:grid" :class="cols">
					<div v-for="key in koi" :key="key" class="m-2 font-semibold">
						<SortableColumn v-if="sort && sort.includes(key)" :query="route.query" :col="key" />
						<span v-else>
							{{ t(`collection-keys["${key}"]`) }}
						</span>
					</div>
				</div>
				<template v-if="docs !== null">
					<div
						v-for="hit in docs.data.hits"
						:key="String(hit.document.id)"
						class="border-b py-1 md:border-t"
					>
						<NuxtLink
							class="grid grid-cols-[1fr_auto] items-center text-clip rounded transition hover:bg-slate-200 active:bg-slate-300"
							:to="
								getDetailLink(
									String(hit.document.object_id || String(hit.document.id)?.replace(/\D/g, '')),
								)
							"
						>
							<div class="hidden md:grid" :class="cols">
								<div
									v-for="key in koi"
									:key="key + hit.document.id"
									class="m-2 self-center overflow-auto"
								>
									<span
										v-if="key === queryBy && hit.highlight[key]?.snippet"
										v-html="hit.highlight[key].snippet"
									/>
									<span v-else>
										{{ get(hit.document, key) }}
									</span>
								</div>
							</div>
							<div class="flex flex-col gap-1 p-1 md:hidden">
								<div v-for="key in koi" :key="key + hit.document.id">
									<div class="text-gray-500">{{ t(`collection-keys["${key}"]`) }}</div>
									<div class="text-2xl">
										<span
											v-if="key === queryBy && hit.highlight[key]?.snippet"
											v-html="hit.highlight[key].snippet"
										/>
										<span v-else>
											{{ get(hit.document, key) }}
										</span>
									</div>
								</div>
							</div>
							<ChevronRight class="h-6 w-6 shrink-0" />
						</NuxtLink>
					</div>
				</template>
				<Pagination
					v-if="docs != null && docs?.data && docs.data.found != 0"
					class="mt-2"
					:page="docs.data.page"
					:limit="docs.data.request_params.per_page || pageLimit"
					:all="docs.data.found"
				/>
			</div>
			<Centered v-else>
				<Loader2 class="h-8 w-8 animate-spin" />
			</Centered>
		</div>
		<div v-if="docs?.data && docs.data.found">
			<FacetDisclosures
				class="float-right m-4 w-96 max-w-full"
				:facets="docs.data.facet_counts"
				:loading="loading"
				:collection="collectionName"
				:query-by="queryBy"
				:default-open="windowWidth >= 1280"
			/>
		</div>
	</div>
</template>

<style lang="postcss">
mark {
	@apply bg-primary-200 p-0.5 -m-0.5 rounded;
}
</style>
