<script setup lang="ts">
import { isEmpty } from "lodash-es";
import { Info } from "lucide-vue-next";
import { useRoute } from "vue-router";

import DetailDisclosure from "@/components/detail-disclosure.vue";
import DetailPage from "@/components/detail-page.vue";
import Indicator from "@/components/indicator.vue";
import { useGetDetails } from "@/composables/use-get-details";
import { useGetDocument } from "@/composables/use-get-document";
import { useGetDocuments } from "@/composables/use-get-documents";
import { detectURLsAddLinks } from "@/lib/helpers";

const t = useTranslations();
const route = useRoute();

const id = String(route.params.id);

const collection = "viecpro_institutions";

const data = ref({
	entity: useGetDocument(
		computed(() => {
			return { collection, id: `Institution_${id}` };
		}),
	),

	details: useGetDetails(
		computed(() => {
			return { model: "institution", id };
		}),
	),

	refs: useGetDocuments({
		collection: "viecpro_references",
		query: {
			q: "*",
			query_by: "shortTitle",
			filter_by: `related_doc.object_id:=${id} && related_doc.model:=Institution`,
			per_page: 250,
		},
	}),
});

const loading = computed(() => {
	return {
		entity: data.value.entity.isFetching,
		details: data.value.details.isFetching,
		refs: data.value.refs.isFetching,
	};
});

const title = computed(() => {
	if (data.value.entity.data?.name) {
		return `${data.value.entity.data.name} - ${t("pages.searchviews.institutions.sing")}`;
	}

	return t("pages.searchviews.institutions.sing");
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
			!loading.refs &&
			(data.details.isLoadingError || data.entity.isLoadingError || data.refs.isLoadingError)
		"
	>
		<div>{{ data.entity.error }}</div>
		<div>{{ data.details.error }}</div>
		<div>{{ data.refs.error }}</div>
	</div>
	<DetailPage v-else :details-loading="loading.details" model="Institution">
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
							:label="data.entity.data?.name"
							model="Institution"
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
									<div>{{ t("detail-page.basedata") }} - Institution</div>
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
					:collection-name="collection"
					default-open
					grid-class="grid-cols-3"
					:headers="['name', 'start', 'end']"
					:loading="loading.details"
					:rels="data.details.data.alternative_names"
					:title="t('collection-keys.viecpro_institutions.alternative_names')"
				/>
				<GenericDisclosure
					:disabled="!data.refs?.data || isEmpty(data.refs.data.hits)"
					:title="t('collection-keys.viecpro_courts.sources')"
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
			<div v-else>No data.</div>
		</template>
		<template #right>
			<div v-if="data.details.data" class="flex flex-col gap-3">
				<DetailDisclosure
					:collection-name="collection"
					default-open
					grid-class="grid-cols-3"
					:headers="['target.name', 'start_date', 'end_date']"
					link-to
					:rels="data.details.data.locations"
					:title="t('collection-keys.viecpro_institutions.locations')"
				/>
				<DetailDisclosure
					collection-name="hierarchy"
					grid-class="grid-cols-2"
					:headers="['relation_type', 'target.name']"
					link-to
					:rels="data.details.data.hierarchy"
					:title="t('collection-keys.viecpro_institutions.hierarchy')"
				/>
				<DetailDisclosure
					collection-name="personnel"
					grid-class="grid-cols-4"
					:headers="['relation_type', 'target.name', 'start_date', 'end_date']"
					link-to
					:rels="data.details.data.personnel"
					:title="t('collection-keys.viecpro_institutions.personnel')"
				/>
			</div>
			<div v-else>No data.</div>
		</template>
	</DetailPage>
</template>
