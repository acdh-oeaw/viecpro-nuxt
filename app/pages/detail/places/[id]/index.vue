<script setup lang="ts">
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { isEmpty } from "lodash-es";
import { Info, Loader2 } from "lucide-vue-next";
import type { SearchResponse } from "typesense/lib/Typesense/Documents";
import { useRoute } from "vue-router";

import Chip from "@/components/chip.vue";
import DetailDisclosure from "@/components/detail-disclosure.vue";
import DetailPage from "@/components/detail-page.vue";
import Indicator from "@/components/indicator.vue";
import MapComponent from "@/components/map-component.vue";
import { getDocuments } from "@/composables/use-ts-data";
import { detectURLsAddLinks } from "@/lib/helpers";
import type { Place, PlaceDetail, Reference } from "@/types/schema";

const t = useTranslations();
const queryClient = useQueryClient();
const route = useRoute();

const id = String(route.params.id);

const collection = "viecpro_places";

const data = ref({
	entity: useQuery({
		queryKey: [collection, id],
		queryFn: () => {
			return getDocument<Place>(collection, `Place_${id}`);
		},
	}),
	details: useQuery({
		queryKey: ["detail", collection, id],
		queryFn: () => {
			return getDetails<PlaceDetail>("place", id);
		},
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

const loading = computed(() => {
	return {
		entity: data.value.entity.isLoading,
		details: data.value.details.isLoading,
	};
});

const relCols = ["relation_type", "target.name", "start_date", "end_date"];

const title = computed(() => {
	if (data.value.entity.data?.name) {
		return `${data.value.entity.data.name} - ${t("pages.searchviews.places.sing")}`;
	}

	return t("pages.searchviews.places.sing");
});

usePageMetadata({
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
	<DetailPage v-else :details-loading="loading.details" :model="t('pages.searchviews.places.sing')">
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
									<Info class="m-2 size-6 shrink-0" />
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

						<DownloadMenu :collection="collection" :data="data" detail title="Download" />
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
					<Loader2 class="size-5 animate-spin" />
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
					:collection-name="collection"
					grid-class="grid-cols-1"
					:headers="['name']"
					:loading="loading.details"
					:rels="data.details.data?.alternative_names.map((name) => ({ name })) || []"
					:title="t('collection-keys.viecpro_places.alternative_names')"
				/>
				<GenericDisclosure
					:disabled="!data.refs.data || isEmpty(data.refs.data.hits)"
					:title="t('collection-keys.viecpro_courts.sources')"
				>
					<div v-if="data.refs.data" class="flex flex-col divide-y-2">
						<div
							v-for="tag in [...new Set(data.refs.data.hits?.map((hit) => hit.document.tag))].sort(
								(a, b) => {
									const standard = [
										'Primärquellen',
										'Sekundärliteratur',
										'Datenbanken',
										'Projekte',
									];
									return standard.indexOf(a) - standard.indexOf(b);
								},
							)"
							:key="String(tag)"
							class="p-2"
						>
							<h2 class="mb-2 font-semibold">
								{{ tag }}
							</h2>
							<template
								v-for="({ document: reference }, i) in data.refs.data.hits.filter(
									(hit) => hit.document.tag === tag,
								)"
								:key="reference.id"
							>
								<div v-if="i !== 0" class="my-1 border" />
								<span
									:class="reference.folio && `after:content-[',_']`"
									v-html="detectURLsAddLinks(reference.title || reference.shortTitle)"
								/>
								<span v-if="reference.folio" v-html="detectURLsAddLinks(reference.folio)" />
							</template>
						</div>
					</div>
				</GenericDisclosure>
				<GenericDisclosure
					default-open
					:disabled="!data.entity.data?.lat || !data.entity.data?.long"
					title="Map"
				>
					<MapComponent
						v-if="!loading.entity && data.entity.data?.lat && data.entity.data.long"
						class="h-96 w-full"
						:point="{ lat: data.entity.data.lat, long: data.entity.data.long }"
					/>
				</GenericDisclosure>
				<GenericDisclosure
					:disabled="isEmpty(data.details.data.sameAs)"
					:title="t('collection-keys.viecpro_persons.same_as')"
				>
					<div class="p-2">
						<div
							v-for="url in data.details.data.sameAs"
							:key="url"
							class="border-t p-1 pl-0 first:border-0"
						>
							<NuxtLink class="font-semibold" :href="url" target="_blank">
								<span class="underline"> {{ url }}</span>
								<span>&nbsp;&#8599;</span>
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
					:collection-name="collection"
					default-open
					grid-class="grid-cols-4"
					:headers="relCols"
					link-to
					:rels="data.details.data.institution_relations"
					:title="t('collection-keys.viecpro_places.institution_relations')"
				/>
				<DetailDisclosure
					collection-name="place_person"
					grid-class="grid-cols-4"
					:headers="relCols"
					link-to
					:rels="data.details.data.person_relations"
					:title="t('collection-keys.viecpro_places.person_relations')"
				/>
				<DetailDisclosure
					collection-name="place_place"
					grid-class="grid-cols-4"
					:headers="relCols"
					link-to
					:rels="data.details.data.place_relations"
					:title="t('collection-keys.viecpro_places.place_relations')"
				/>
			</div>
			<div v-else>{{ t("ui.no-data") }}.</div>
		</template>
	</DetailPage>
</template>
