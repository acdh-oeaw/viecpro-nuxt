<script setup lang="ts">
import { isEmpty } from "lodash-es";
import { Info, Loader2 } from "lucide-vue-next";
import * as v from "valibot";
import { useRoute } from "vue-router";

import Chip from "@/components/chip.vue";
import DetailDisclosure from "@/components/detail-disclosure.vue";
import DetailPage from "@/components/detail-page.vue";
import Indicator from "@/components/indicator.vue";
import { useCourt } from "@/composables/use-court";
import { useCourtDetails } from "@/composables/use-court-details";
import { useReferences } from "@/composables/use-references";
import { detectURLsAddLinks } from "@/lib/helpers";
import { createPageTitle } from "@/utils/create-page-title";

const ParamsSchema = v.object({
	id: v.pipe(v.unknown(), v.transform(Number)),
});

const t = useTranslations();

const route = useRoute();

const params = computed(() => {
	return v.parse(ParamsSchema, route.params);
});

const id = computed(() => {
	return params.value.id;
});

// FIXME: the details collection seems to not include everything from the entity collection,
// so we need both requests
const entityQuery = useCourt(id);
const { data: entity } = entityQuery;

const detailsQuery = useCourtDetails(id);
const { data: details } = detailsQuery;

const referencesQuery = useReferences(id);
const { data: references } = referencesQuery;

const isLoading = computed(() => {
	return (
		entityQuery.isFetching.value ||
		detailsQuery.isFetching.value ||
		referencesQuery.isFetching.value
	);
});

const isError = computed(() => {
	return entityQuery.isError.value || detailsQuery.isError.value || referencesQuery.isError.value;
});

usePageMetadata({
	title: computed(() => {
		return createPageTitle(entity.value?.name, t("CourtDetailsPage.meta.title"));
	}),
});

const columns = ["relation_type", "target.name", "start_date", "end_date"];
</script>

<template>
	<div v-if="!isLoading && isError">
		<div>{{ t("common.query-error") }}</div>
	</div>

	<DetailPage
		v-else
		:details-loading="detailsQuery.isFetching.value"
		:title="t('CourtDetailsPage.meta.title')"
	>
		<template #head>
			<div class="w-full font-bold text-primary-600 xl:my-2 xl:text-4xl">
				<div
					v-if="!entityQuery.isFetching.value && entity != null"
					class="mb-4 flex flex-col justify-between gap-4 md:m-0 md:flex-row md:items-center md:gap-8"
				>
					<h1 class="text-4xl">
						{{ entity.name }}
					</h1>
					<div class="flex items-center gap-2">
						<Indicator
							class="w-24"
							:status="details?.ampel"
							:title="t('collection-keys.viecpro_persons.ampel')"
						/>
						<HierarchyLinkButton
							:id="String(entity.object_id)"
							:label="entity.name"
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
									<div>
										{{ t("detail-page.basedata") }} - {{ t("pages.searchviews.courts.sing") }}
									</div>
									<div>
										{{ entity.name }}
									</div>
									<div>VieCPro-ID: {{ entity.id }}</div>
									<div>URI: <CurrentUri link /></div>
								</div>
							</template>
						</InfoMenu>
						<DownloadMenu collection="viecpro_courts" :data="data" detail title="Download" />
					</div>
				</div>
				<span v-else class="animate-pulse">{{ t("ui.loading") }}</span>
			</div>
			<h2>
				{{ entity?.kind }}
				<span v-if="details?.category">- {{ details.category }}</span>
			</h2>
			<Chip
				v-if="detailsQuery.isFetching.value || details?.alternative_names.length !== 0"
				class="my-1 text-sm lg:text-base"
				square
			>
				<template v-if="!detailsQuery.isFetching.value">
					<span v-if="details != null">
						{{
							details.alternative_names
								.map((name) => name.name)
								.slice(0, 3)
								.join(" - ")
						}}
					</span>
					<span v-if="details?.alternative_names && details?.alternative_names.length > 3">
						+
						{{ details.alternative_names.length - 3 }}
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
			<template v-if="!detailsQuery.isFetching.value">
				<NuxtLink
					v-if="
						details?.resolution &&
						details.owners &&
						details.owners[0] &&
						details.resolution.includes(String(details.owners[0].target.name))
					"
					class="underline"
					:to="`/detail/persons/${details.owners[0].target.object_id}`"
				>
					{{ details?.resolution }}
				</NuxtLink>
				<span v-else>
					{{ details?.resolution }}
				</span>
			</template>
			<span v-else class="animate-pulse">{{ t("ui.loading") }}</span>
			<div class="col-span-2 my-1 border-t"></div>
			<span>{{ t("collection-keys.viecpro_courts.category") }}:</span>
			<span v-if="!detailsQuery.isFetching.value">{{ details?.category }}</span>
			<span v-else class="animate-pulse">{{ t("ui.loading") }}</span>
			<div class="col-span-2 my-1 border-t"></div>
			<span>{{ t("detail-page.runtime") }}:</span>
			<span v-if="!entityQuery.isFetching.value"
				>{{ entity?.start_date }} - {{ entity?.end_date }}</span
			>
			<span v-else class="animate-pulse">{{ t("ui.loading") }}</span>
			<div class="col-span-2 my-1 border-t"></div>
			<span>{{ t("collection-keys.viecpro_courts.id") }}:</span>
			<span v-if="!entityQuery.isFetching.value">{{ entity?.id }}</span>
			<span v-else class="animate-pulse">{{ t("ui.loading") }}</span>
			<div class="col-span-2 my-1 border-t"></div>
		</template>

		<template #left>
			<div v-if="details != null" class="flex flex-col gap-3">
				<GenericDisclosure
					:disabled="references == null || isEmpty(references.hits)"
					:title="t('collection-keys.viecpro_courts.sources')"
				>
					<div v-if="references != null" class="flex flex-col divide-y-2">
						<div
							v-for="tag in [...new Set(references.hits?.map((hit) => hit.document.tag))].sort(
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
							<h2 class="mb-2 font-semibold">{{ tag }}</h2>

							<template
								v-for="({ document: reference }, i) in references.hits?.filter(
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
					:disabled="isEmpty(details.sameAs)"
					:title="t('collection-keys.viecpro_persons.same_as')"
				>
					<div class="p-2">
						<div v-for="url in details.sameAs" :key="url" class="border-t p-1 pl-0 first:border-0">
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
			<div v-if="details != null" class="flex flex-col gap-3">
				<h2 class="text-2xl text-gray-500">{{ t("detail-page.relations") }}</h2>

				<DetailDisclosure
					collection-name="personnel"
					default-open
					grid-class="grid-cols-4"
					:headers="columns"
					link-to
					:loading="detailsQuery.isFetching.value"
					:rels="details.personnel"
					:title="t('collection-keys.viecpro_courts.personnel')"
				/>

				<DetailDisclosure
					collection-name="viecpro_courts"
					grid-class="grid-cols-3"
					:headers="['target.name', 'start_date', 'end_date']"
					link-to
					:loading="detailsQuery.isFetching.value"
					:rels="details.locations"
					:title="t('collection-keys.viecpro_courts.locations')"
				/>

				<DetailDisclosure
					collection-name="viecpro_courts"
					grid-class="grid-cols-4"
					:headers="columns"
					link-to
					:loading="detailsQuery.isFetching.value"
					:rels="details.hierarchy"
					:title="t('collection-keys.viecpro_courts.hierarchy')"
				/>
			</div>

			<div v-else>{{ t("ui.no-data") }}.</div>
		</template>
	</DetailPage>
</template>
