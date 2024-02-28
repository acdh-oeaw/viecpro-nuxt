<script lang="ts" setup>
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { useWindowSize } from "@vueuse/core";
import { get } from "lodash-es";
import { ChevronDown, ChevronRight, Loader2, Search, XCircle } from "lucide-vue-next";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

import type { AnyEntity } from "@/types/schema";
import { NuxtLink } from "#components";

const locale = useLocale();
const t = useTranslations();
const queryClient = useQueryClient();

const props = defineProps<{
	queryBy: Array<string> | string;
	collectionName:
		| "viecpro_courts"
		| "viecpro_events"
		| "viecpro_institutions"
		| "viecpro_persons"
		| "viecpro_places"
		| "viecpro_references"
		| "viecpro_relations";
	koi: Array<string>;
	facets?: Array<string>;
	cols: string;
	sort?: Array<string>;
	customCols?: Record<string, string>;
}>();

const pageLimit = 25;

const route = useRoute();

const input = ref(route.query.q === undefined ? "" : String(route.query.q));

const windowWidth = useWindowSize().width;

const isLinkCol = (key: string, document: AnyEntity) => {
	return (
		props.customCols?.[key] &&
		(props.customCols[key] === "default" ||
			(document[props.customCols[key]] &&
				Object.keys(document[props.customCols[key]]).length !== 0))
	);
};

const pageNum = computed(() => {
	return Number(route.query.page) || 1;
});
const limitNum = computed(() => {
	return Number(route.query.limit) || pageLimit;
});

const comQuery = computed(() => {
	const query = route.query;
	return {
		q: String(query.q ?? ""),
		query_by: props.queryBy,
		facet_by: props.facets ? props.facets.join(",") : "",
		filter_by: String(query.facets ?? ""),
		page: pageNum.value,
		per_page: limitNum.value || pageLimit,
		sort_by: String(query.sort ?? ""),
	};
});
const { data, isFetching: loading } = useQuery({
	queryKey: ["search", props.collectionName, comQuery] as const,
	queryFn: async ({ queryKey }) => {
		const [, collection, q] = queryKey;
		const response = await getDocuments(q, collection);
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

// TODO: finde better solution
const getDetailLink = (id: string, entity?: string) => {
	const type = entity ?? route.path.split("/")[3];
	return `/${locale.value}/detail/${type}/${id}`;
};
</script>

<template>
	<div class="mx-2 flex h-full flex-col-reverse gap-4 xl:grid xl:grid-cols-[4fr_2fr]">
		<div class="mx-auto flex h-full w-full max-w-container flex-col p-2 xl:p-0">
			<div
				class="mb-4 grid h-12 w-full shrink-0 grid-cols-[auto_1fr_auto] items-center rounded border bg-white shadow-md xl:my-4"
			>
				<label for="searchinput">
					<Search class="ml-3 mr-1 h-5 w-5 shrink-0 text-gray-400" />
					<span class="sr-only">
						{{ t("ui.search-placeholder") }}
					</span>
				</label>
				<input
					id="searchinput"
					v-model="input"
					type="text"
					class="h-full rounded pl-2"
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
			<!-- <DownloadResultsWrapper
				v-if="data && data.page"
				:all="data.found"
				:collection="collectionName"
				:query="comQuery"
			/> -->
			<div class="flex w-full justify-end">
				<DownloadMenu
					v-if="data && data.page"
					class="float-right m-2"
					:all="data.found"
					:collection="collectionName"
					:query="comQuery"
				/>
			</div>
			<Pagination
				v-if="data && data.page"
				:page="data.page"
				:limit="data.request_params.per_page || pageLimit"
				:all="data.found"
			/>
			<div v-if="!loading && data" class="w-full">
				<div class="grid" :class="cols + ' ' + (!customCols && 'mr-6')">
					<div v-for="key in koi" :key="String(key)" class="m-2 font-semibold">
						<SortableColumn
							v-if="sort && sort.includes(key)"
							:query="route.query"
							:col="key"
							:collection-name="collectionName"
						/>
						<div
							v-else-if="t(`collection-keys['${collectionName}']['${key}']`) === 'ID'"
							class="flex items-center gap-2"
						>
							<span>ID</span>
							<ChevronDown v-if="!route.query.sort" class="h-5 w-5 opacity-50" />
						</div>
						<span v-else-if="key !== 'ampel'" class="hidden md:block">
							{{ t(`collection-keys["${collectionName}"]["${key}"]`) }}
						</span>
					</div>
				</div>
				<template v-if="data !== null">
					<div
						v-for="hit in data.hits"
						:key="String(hit.document.id)"
						class="border-b py-1 md:border-t"
					>
						<component
							:is="customCols ? 'div' : NuxtLink"
							class="grid grid-cols-[1fr_auto] items-center text-clip"
							:class="!customCols && 'rounded transition hover:bg-slate-200 active:bg-slate-300'"
							:to="
								getDetailLink(
									String(hit.document.object_id || String(hit.document.id)?.replace(/\D/g, '')),
								)
							"
						>
							<div class="md:grid" :class="cols">
								<div
									v-for="key in koi"
									:key="key + hit.document.id"
									class="self-center overflow-auto"
								>
									<span class="ml-2 text-sm text-gray-600 md:hidden">
										{{ t(`collection-keys["${collectionName}"]["${key}"]`) }}
									</span>
									<component
										:is="isLinkCol(key, hit.document) ? NuxtLink : 'span'"
										class="flex items-center justify-between gap-1"
										:class="
											isLinkCol(key, hit.document) &&
											'rounded transition hover:bg-slate-200 active:bg-slate-300 font-semibold'
										"
										:to="
											customCols && isLinkCol(key, hit.document)
												? customCols[key] === 'default'
													? getDetailLink(String(hit.document.object_id))
													: getDetailLink(
															hit.document[customCols[key]].object_id,
															String(hit.document[customCols[key]].model).toLowerCase() + 's',
														)
												: undefined
										"
									>
										<span v-if="key.includes('label:')" class="m-2">
											{{
												hit.document.labels
													.filter((label) => label.label_type.includes(key.replace("label:", "")))
													.map((label) => label.name)
													.join("; ")
											}}
										</span>
										<span v-else-if="key === 'ampel'" class="mx-auto">
											<Indicator class="h-5 w-5" :status="hit.document.ampel" small />
										</span>
										<span
											v-else-if="get(hit.highlight, key)?.snippet"
											class="m-2"
											v-html="get(hit.highlight, key).snippet"
										/>
										<span
											v-else-if="['kategorie', 'institutions', 'alternativenames'].includes(key)"
										>
											{{ get(hit.document, key).join(", ") }}
										</span>
										<span v-else class="m-2">
											{{ get(hit.document, key) }}
										</span>
										<ChevronRight v-if="isLinkCol(key, hit.document)" class="h-6 w-6 shrink-0" />
									</component>
								</div>
							</div>

							<ChevronRight v-if="!customCols" class="h-6 w-6 shrink-0" />
						</component>
					</div>
				</template>

				<Pagination
					v-if="data && data.found != 0"
					class="mt-2"
					:page="data.page"
					:limit="data.request_params.per_page || pageLimit"
					:all="data.found"
				/>
			</div>
			<Centered v-else>
				<Loader2 class="h-8 w-8 animate-spin" />
			</Centered>
		</div>
		<div v-if="!loading && data">
			<FacetDisclosures
				class="ml-2 w-full max-w-full pr-4 lg:float-right lg:mx-0 lg:mt-6 lg:w-96"
				:facets="data.facet_counts"
				:filter-by="String(comQuery.filter_by)"
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
