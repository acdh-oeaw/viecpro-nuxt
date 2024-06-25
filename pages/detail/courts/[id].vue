<script setup lang="ts">
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { isEmpty } from "lodash-es";
import { Info, Loader2 } from "lucide-vue-next";
import { useRoute } from "vue-router";

import Chip from "@/components/chip.vue";
import DetailDisclosure from "@/components/detail-disclosure.vue";
import DetailPage from "@/components/detail-page.vue";
import Indicator from "@/components/indicator.vue";
import { detectURLsAddLinks } from "@/lib/helpers";
import type { Court, CourtDetail } from "@/types/schema";
import { definePageMeta, getDetails, getDocument, ref } from "#imports";

const t = useTranslations();
const localePath = useLocalePath();
const queryClient = useQueryClient();

const route = useRoute();
const id = String(route.params.id);

const collection = "viecpro_courts";

const data = ref({
	entity: useQuery({
		queryKey: [collection, id],
		queryFn: () => getDocument<Court>(collection, `Hofstaat_${id}`),
	}),
	details: useQuery({
		queryKey: ["detail", collection, id],
		queryFn: () => getDetails<CourtDetail>("court", id, "institution"),
	}),
	refs: useQuery({
		queryKey: [
			"search",
			"viecpro_references",
			{
				q: "*",
				query_by: "shortTitle",
				filter_by: `related_doc.object_id:=${id} && related_doc.model:=Institution`,
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
	entity: data.value.entity.isFetching,
	details: data.value.details.isFetching,
	refs: data.value.refs.isFetching,
}));

const relCols = ["relation_type", "target.name", "start_date", "end_date"];

definePageMeta({
	title: "pages.searchviews.courts.title",
});

const title = computed(() => {
	if (data.value.entity.data?.name)
		return `${data.value.entity.data.name} - ${t("pages.searchviews.courts.sing")}`;
	return t("pages.searchviews.courts.sing");
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
			!loading.refs &&
			(data.details.isLoadingError || data.entity.isLoadingError || data.refs.isLoadingError)
		"
	>
		<div>{{ data.entity.error }}</div>
		<div>{{ data.details.error }}</div>
		<div>{{ data.refs.error }}</div>
	</div>
	<DetailPage v-else :model="t('pages.searchviews.courts.sing')" :details-loading="loading.details">
		<template #head>
			<div class="w-full font-bold text-primary-600 xl:my-2 xl:text-4xl">
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
							:status="data.details.data?.ampel"
							:title="t('collection-keys.viecpro_persons.ampel')"
						/>
						<HierarchyLinkButton
							:id="String(data.entity.data?.object_id)"
							model="Institution"
							:label="data.entity.data?.name"
							:title="t('collection-keys.viecpro_persons.hierarchy')"
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
										{{ t("detail-page.basedata") }} - {{ t("pages.searchviews.courts.sing") }}
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
			<h2>
				{{ data.entity.data?.kind }}
				<span v-if="data.details.data?.category">- {{ data.details.data.category }}</span>
			</h2>
			<Chip
				v-if="loading.details || data.details.data?.alternative_names.length !== 0"
				class="my-1 text-sm lg:text-base"
				square
			>
				<template v-if="!loading.details">
					<span v-if="data.details.data">
						{{
							data.details.data.alternative_names
								.map((name) => name.name)
								.slice(0, 3)
								.join(" - ")
						}}
					</span>
					<span
						v-if="
							data.details.data?.alternative_names &&
							data.details.data?.alternative_names.length > 3
						"
					>
						+
						{{ data.details.data.alternative_names.length - 3 }}
					</span>
				</template>
				<span v-else>
					<Loader2 class="size-5 animate-spin" />
				</span>
			</Chip>
		</template>
		<template #base>
			<div class="col-span-2 my-1 border-t"></div>
			<span>{{ t("collection-keys.viecpro_courts.resolution") }}:</span>
			<template v-if="!loading.details">
				<NuxtLink
					v-if="
						data.details.data?.resolution &&
						data.details.data.owners &&
						data.details.data.owners[0] &&
						data.details.data.resolution.includes(String(data.details.data.owners[0].target.name))
					"
					:to="localePath(`/detail/persons/${data.details.data.owners[0].target.object_id}`)"
					class="underline"
				>
					{{ data.details.data?.resolution }}
				</NuxtLink>
				<span v-else>
					{{ data.details.data?.resolution }}
				</span>
			</template>
			<span v-else class="animate-pulse">{{ t("ui.loading") }}</span>
			<div class="col-span-2 my-1 border-t"></div>
			<span>{{ t("collection-keys.viecpro_courts.category") }}:</span>
			<span v-if="!loading.details">{{ data.details.data?.category }}</span>
			<span v-else class="animate-pulse">{{ t("ui.loading") }}</span>
			<div class="col-span-2 my-1 border-t"></div>
			<span>{{ t("detail-page.runtime") }}:</span>
			<span v-if="!loading.entity"
				>{{ data.entity.data?.start_date }} - {{ data.entity.data?.end_date }}</span
			>
			<span v-else class="animate-pulse">{{ t("ui.loading") }}</span>
			<div class="col-span-2 my-1 border-t"></div>
			<span>{{ t("collection-keys.viecpro_courts.id") }}:</span>
			<span v-if="!loading.entity">{{ data.entity.data?.id }}</span>
			<span v-else class="animate-pulse">{{ t("ui.loading") }}</span>
			<div class="col-span-2 my-1 border-t"></div>
		</template>
		<template #left>
			<div v-if="data.details.data" class="flex flex-col gap-3">
				<!-- <DetailDisclosure
					:title="t('collection-keys.viecpro_courts.download')"
					:collection-name="collection"
					:rels="[]"
					:headers="[]"
				/> -->
				<GenericDisclosure
					:title="t('collection-keys.viecpro_courts.sources')"
					:disabled="!data.refs.data || isEmpty(data.refs.data.hits)"
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
					:title="t('collection-keys.viecpro_persons.same_as')"
					:disabled="isEmpty(data.details.data.sameAs)"
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
					:title="t('collection-keys.viecpro_courts.personnel')"
					:rels="data.details.data.personnel"
					:headers="relCols"
					grid-class="grid-cols-4"
					collection-name="personnel"
					:loading="loading.details"
					link-to
					default-open
				/>
				<DetailDisclosure
					:title="t('collection-keys.viecpro_courts.locations')"
					:rels="data.details.data.locations"
					:headers="['target.name', 'start_date', 'end_date']"
					grid-class="grid-cols-3"
					:loading="loading.details"
					:collection-name="collection"
					link-to
				/>
				<DetailDisclosure
					:title="t('collection-keys.viecpro_courts.hierarchy')"
					:rels="data.details.data.hierarchy"
					:headers="relCols"
					grid-class="grid-cols-4"
					:loading="loading.details"
					:collection-name="collection"
					link-to
				/>
			</div>
			<div v-else>{{ t("ui.no-data") }}.</div>
		</template>
	</DetailPage>
</template>
