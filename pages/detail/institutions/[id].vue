<script setup lang="ts">
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { isEmpty } from "lodash-es";
import { ExternalLink, Info } from "lucide-vue-next";
import { useRoute } from "vue-router";

import DetailDisclosure from "@/components/detail-disclosure.vue";
import DetailPage from "@/components/detail-page.vue";
import Indicator from "@/components/indicator.vue";
import { detectURLsAddLinks } from "@/lib/helpers";
import type { Court, CourtDetail, Institution, InstitutionDetail } from "@/types/schema";
import { definePageMeta, getDetails, getDocument, ref } from "#imports";

const t = useTranslations();
const route = useRoute();
const queryClient = useQueryClient();

const id = String(route.params.id);

const collection = "viecpro_institutions";

const data = ref({
	entity: useQuery({
		queryKey: [collection, id],
		queryFn: () => getDocument<Institution>(collection, `Institution_${id}`),
		retry: 2,
	}),
	details: useQuery({
		queryKey: ["detail", collection, id],
		queryFn: () => getDetails<InstitutionDetail>("institution", id),
		retry: 2,
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

// The following code is hopefully just a placeholder until there is a clearer distinction between courts and institutions: If there are no results, this app will try to fetch the same ID in the courts table and redirect the use

const fetchCourts = computed(() => {
	if (
		data.value.details.error?.httpStatus &&
		data.value.details.error?.httpStatus === 404 &&
		data.value.entity.error?.httpStatus &&
		data.value.entity.error?.httpStatus === 404
	)
		return true;
	return false;
});

const altData = ref({
	entity: useQuery({
		queryKey: ["viecpro_courts", id],
		queryFn: () => getDocument<Court>("viecpro_courts", `Hofstaat_${id}`),
		enabled: fetchCourts,
	}),
	details: useQuery({
		queryKey: ["detail", "viecpro_courts", id],
		queryFn: () => getDetails<CourtDetail>("court", id, "institution"),
		enabled: fetchCourts,
	}),
});

watch(
	() => [altData.value.details.isSuccess, altData.value.entity.isSuccess],
	(to) => {
		const router = useRouter();
		if (to.every(Boolean)) {
			void router.replace(route.fullPath.replace("institution", "court"));
		}
	},
	{ immediate: true },
);

// thanks for understanding

const loading = computed(() => ({
	entity: data.value.entity.isFetching,
	details: data.value.details.isFetching,
	refs: data.value.refs.isFetching,
}));

definePageMeta({
	title: "pages.searchviews.institutions.title",
});

const title = computed(() => {
	if (data.value.entity.data?.name) return `${data.value.entity.data.name} - Institution`;
	return "Institution";
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
			(data.details.isLoadingError || data.entity.isLoadingError || data.refs.isLoadingError) &&
			(altData.details.isLoadingError || altData.entity.isLoadingError)
		"
	>
		<div>{{ data.entity.error }}</div>
		<div>{{ data.details.error }}</div>
		<div>{{ data.refs.error }}</div>
		<div>{{ altData.entity.error }}</div>
		<div>{{ altData.details.error }}</div>
	</div>
	<DetailPage v-else model="Institution" :details-loading="loading.details">
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
									<Info class="m-2 h-6 w-6 shrink-0" />
								</button>
							</template>
							<template #content>
								<div class="text-base font-normal text-black">
									<div>{{ t("detail-page.basedata") }} - Institution</div>
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
		</template>
		<template #base>
			<div class="col-span-2 my-1 border-t"></div>
			<span>{{ t("collection-keys.viecpro_institutions.resolution") }}:</span>
			<span v-if="!loading.details">{{ data.details.data?.resolution }}</span>
			<span v-else class="animate-pulse">{{ t("ui.loading") }}</span>
			<div class="col-span-2 my-1 border-t"></div>

			<span>{{ t("detail-page.runtime") }}:</span>
			<span v-if="!loading.entity">
				{{ data.entity.data?.start_date }} - {{ data.entity.data?.end_date }}
			</span>
			<span v-else class="animate-pulse">{{ t("ui.loading") }}</span>
			<div class="col-span-2 my-1 border-t"></div>

			<span>{{ t("collection-keys.viecpro_institutions.category") }}:</span>
			<span v-if="!loading.details">{{ data.details.data?.category }}</span>
			<span v-else class="animate-pulse">{{ t("ui.loading") }}</span>
			<div class="col-span-2 my-1 border-t"></div>
		</template>
		<template #left>
			<div v-if="data.details.data" class="flex flex-col gap-3">
				<DetailDisclosure
					default-open
					:title="t('collection-keys.viecpro_institutions.alternative_names')"
					:rels="data.details.data.alternative_names"
					:headers="['name', 'start', 'end']"
					grid-class="grid-cols-3"
					:loading="loading.details"
					:collection-name="collection"
				/>
				<GenericDisclosure
					:title="t('collection-keys.viecpro_courts.sources')"
					:disabled="!data.refs?.data || isEmpty(data.refs.data.hits)"
				>
					<div v-if="data.refs?.data" class="flex flex-col divide-y-2">
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
			<div v-else>No data.</div>
		</template>
		<template #right>
			<div v-if="data.details.data" class="flex flex-col gap-3">
				<DetailDisclosure
					default-open
					:title="t('collection-keys.viecpro_institutions.locations')"
					:headers="['target.name', 'start_date', 'end_date']"
					grid-class="grid-cols-3"
					:rels="data.details.data.locations"
					:collection-name="collection"
					link-to
				/>
				<DetailDisclosure
					:title="t('collection-keys.viecpro_institutions.hierarchy')"
					:headers="['relation_type', 'target.name']"
					:rels="data.details.data.hierarchy"
					grid-class="grid-cols-2"
					collection-name="hierarchy"
					link-to
				/>
				<DetailDisclosure
					:title="t('collection-keys.viecpro_institutions.personnel')"
					:headers="['relation_type', 'target.name', 'start_date', 'end_date']"
					:rels="data.details.data.personnel"
					grid-class="grid-cols-4"
					collection-name="personnel"
					link-to
				/>
			</div>
			<div v-else>No data.</div>
		</template>
	</DetailPage>
</template>
