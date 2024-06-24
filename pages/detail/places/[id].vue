<script setup lang="ts">
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { isEmpty } from "lodash-es";
import { ExternalLink, Info, Loader2 } from "lucide-vue-next";
import type { SearchResponse } from "typesense/lib/Typesense/Documents";
import { useRoute } from "vue-router";

import Chip from "@/components/chip.vue";
import DetailDisclosure from "@/components/detail-disclosure.vue";
import DetailPage from "@/components/detail-page.vue";
import Indicator from "@/components/indicator.vue";
import MapComponent from "@/components/map-component.vue";
import type { Place, PlaceDetail, Reference } from "@/types/schema";
import { definePageMeta, getDetails, getDocument, ref } from "#imports";

const t = useTranslations();
const queryClient = useQueryClient();
const route = useRoute();

const id = String(route.params.id);

const collection = "viecpro_places";

const data = ref({
	entity: useQuery({
		queryKey: [collection, id],
		queryFn: () => getDocument<Place>(collection, `Place_${id}`),
	}),
	details: useQuery({
		queryKey: ["detail", collection, id],
		queryFn: () => getDetails<PlaceDetail>("place", id),
	}),
	refs: useQuery({
		queryKey: [
			"search",
			"viecpro_references",
			{
				q: "*",
				query_by: "shortTitle",
				filter_by: `related_doc.object_id:=${id} && related_doc.model:=Place`,
				per_page: 250,
			},
		] as const,
		queryFn: async ({ queryKey }) => {
			const [, collection, query] = queryKey;
			const response = await getDocuments(query, collection);
			if (response.hits) {
				response.hits.forEach((hit) => {
					queryClient.setQueryData([collection, String(hit.document.object_id)], hit.document);
				});
			}
			return response as SearchResponse<Reference>;
		},
	}),
});

const loading = computed(() => ({
	entity: data.value.entity.isLoading,
	details: data.value.details.isLoading,
}));

const relCols = ["relation_type", "target.name", "start_date", "end_date"];

definePageMeta({
	title: "pages.searchviews.places.title",
});

const title = computed(() => {
	if (data.value.entity.data?.name)
		return `${data.value.entity.data.name} - ${t("pages.searchviews.places.sing")}`;
	return t("pages.searchviews.places.sing");
});

useHead({
	title,
});
</script>

<template>
	<div
		v-if="
			!loading.entity &&
			!loading.details &&
			(data.details.isLoadingError || data.entity.isLoadingError)
		"
	>
		<div>{{ data.entity.error }}</div>
		<div>{{ data.details.error }}</div>
	</div>
	<DetailPage v-else :model="t('pages.searchviews.places.sing')" :details-loading="loading.details">
		<template #head>
			<div class="font-bold text-primary-600 xl:my-2 xl:text-4xl">
				<div
					v-if="!loading.entity && data.entity.data"
					class="mb-4 flex flex-col justify-between gap-4 md:m-0 md:flex-row md:items-center md:gap-8"
				>
					<h1 class="text-4xl">
						{{ data.entity.data?.name }}
					</h1>
					<div class="flex items-center gap-2">
						<Indicator
							class="w-24"
							:status="data.entity.data?.ampel"
							:title="t('collection-keys.viecpro_persons.ampel')"
						/>
						<InfoMenu>
							<template #button>
								<button
									class="rounded-full hover:bg-slate-200 active:bg-slate-300"
									:title="t('collection-keys.viecpro_persons.citations')"
								>
									<span class="sr-only">Show Infos</span>
									<Info class="m-2 h-6 w-6 shrink-0" />
								</button>
							</template>
							<template #content>
								<div class="text-base font-normal text-black">
									<div>
										{{ t("detail-page.basedata") }} - {{ t("pages.searchviews.places.sing") }}
									</div>
									<div>
										{{ data.entity.data?.name }}
									</div>
									<div>VieCPro-ID: {{ data.entity.data?.id }}</div>
									<div>URI: <CurrentUri link /></div>
								</div>
							</template>
						</InfoMenu>

						<DownloadMenu detail :data="data" :collection="collection" title="Download" />
					</div>
				</div>
				<span v-else class="animate-pulse">{{ t("ui.loading") }}</span>
			</div>
			<Chip
				v-if="loading.details || data.details.data?.institution_relations.length !== 0"
				class="my-1 text-sm lg:text-base"
				square
			>
				<template v-if="!loading.details">
					<span v-if="data.details.data">
						{{
							data.details.data.institution_relations
								.map((func) => func.target.name)
								.slice(0, 3)
								.join(" - ")
						}}
					</span>
					<span
						v-if="
							data.details.data?.institution_relations &&
							data.details.data?.institution_relations.length > 3
						"
					>
						+
						{{ data.details.data.institution_relations.length - 3 }}
					</span>
				</template>
				<span v-else>
					<Loader2 class="h-5 w-5 animate-spin" />
				</span>
			</Chip>
		</template>
		<template #base>
			<div class="col-span-2 my-1 border-t"></div>
			<span>{{ t("collection-keys.viecpro_places.kind") }}:</span>
			<span v-if="!loading.entity">{{ data.entity.data?.kind }}</span>
			<span v-else class="animate-pulse">{{ t("ui.loading") }}</span>
			<div class="col-span-2 my-1 border-t"></div>
			<span>{{ t("detail-page.coords") }}:</span>
			<span v-if="!loading.entity">{{ data.entity.data?.lat }} - {{ data.entity.data?.long }}</span>
			<span v-else class="animate-pulse">{{ t("ui.loading") }}</span>
			<div class="col-span-2 my-1 border-t"></div>
		</template>
		<template #left>
			<div
				v-if="data.details.data && data.entity.data && data.refs.data"
				class="flex flex-col gap-3"
			>
				<DetailDisclosure
					v-if="data.details.data"
					:title="t('collection-keys.viecpro_places.alternative_names')"
					:rels="data.details.data?.alternative_names.map((name) => ({ name })) || []"
					:headers="['name']"
					grid-class="grid-cols-1"
					:loading="loading.details"
					:collection-name="collection"
				/>
				<GenericDisclosure
					:title="t('collection-keys.viecpro_courts.sources')"
					:disabled="!data.refs.data.hits || isEmpty(data.refs.data.hits)"
				>
					<div v-if="data.refs.data.hits && !isEmpty(data.refs.data.hits)">
						<template
							v-for="({ document: reference }, i) in data.refs.data.hits"
							:key="reference.id"
						>
							<div v-if="i != 0" class="my-1 border" />
							<div class="flex flex-col gap-1 p-2">
								<h3 class="border-b">
									{{ reference.title || reference.shortTitle }}
								</h3>
								<span>{{ reference.folio }}</span>
								<span class="text-sm text-gray-400">{{ reference.id }}</span>
							</div>
						</template>
					</div>
				</GenericDisclosure>
				<GenericDisclosure
					title="Map"
					default-open
					:disabled="!data.entity.data?.lat || !data.entity.data?.long"
				>
					<MapComponent
						v-if="!loading.entity && data.entity.data?.lat && data.entity.data.long"
						class="h-96 w-full"
						:point="{ lat: data.entity.data.lat, long: data.entity.data.long }"
					/>
				</GenericDisclosure>
				<GenericDisclosure
					:title="t('collection-keys.viecpro_persons.same_as')"
					:disabled="isEmpty(data.details.data.sameAs)"
				>
					<div class="p-2">
						<div
							v-for="url in data.details.data.sameAs"
							:key="url"
							class="border-t p-1 pl-0 first:border-0"
						>
							<NuxtLink class="flex items-center gap-1 font-semibold underline" :href="url">
								<span>
									{{ url }}
								</span>
								<ExternalLink class="h-4 w-4 shrink-0" />
							</NuxtLink>
						</div>
					</div>
				</GenericDisclosure>
			</div>
			<div v-else>{{ t("ui.no-data") }}.</div>
		</template>
		<template #right>
			<div v-if="data.details.data" class="flex flex-col gap-3">
				<h2 class="text-2xl text-gray-500">{{ t("detail-page.relations") }}</h2>
				<DetailDisclosure
					default-open
					:title="t('collection-keys.viecpro_places.institution_relations')"
					:headers="relCols"
					:rels="data.details.data.institution_relations"
					grid-class="grid-cols-4"
					:collection-name="collection"
					link-to
				/>
				<DetailDisclosure
					:title="t('collection-keys.viecpro_places.person_relations')"
					:rels="data.details.data.person_relations"
					:headers="relCols"
					grid-class="grid-cols-4"
					collection-name="place_person"
					link-to
				/>
				<DetailDisclosure
					:title="t('collection-keys.viecpro_places.place_relations')"
					:rels="data.details.data.place_relations"
					:headers="relCols"
					grid-class="grid-cols-4"
					collection-name="place_place"
					link-to
				/>
			</div>
			<div v-else>{{ t("ui.no-data") }}.</div>
		</template>
	</DetailPage>
</template>
