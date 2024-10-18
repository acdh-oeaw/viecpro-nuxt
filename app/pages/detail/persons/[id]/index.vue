<script setup lang="ts">
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { isEmpty } from "lodash-es";
import { Info, StickyNote } from "lucide-vue-next";
import type { SearchResponse } from "typesense/lib/Typesense/Documents";
import { useRoute } from "vue-router";

import DetailDisclosure from "@/components/detail-disclosure.vue";
import DetailPage from "@/components/detail-page.vue";
import Indicator from "@/components/indicator.vue";
import { detectURLsAddLinks } from "@/lib/helpers";
import type { Person, PersonDetail, Reference } from "@/types/schema";
import { getDetails, getDocument, ref } from "#imports";

const t = useTranslations();
const queryClient = useQueryClient();
const route = useRoute();

const id = String(route.params.id);

const collection = "viecpro_persons";

const data = ref({
	entity: useQuery({
		queryKey: [collection, id],
		queryFn: () => {
			return getDocument<Person>(collection, `Person_${id}`);
		},
	}),
	details: useQuery({
		queryKey: ["detail", collection, id],
		queryFn: () => {
			return getDetails<PersonDetail>("person", id);
		},
	}),
	refs: useQuery({
		queryKey: [
			"search",
			"viecpro_references",
			{
				q: "*",
				query_by: "shortTitle",
				filter_by: `related_doc.object_id:=${id} && related_doc.model:=Person`,
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
		entity: data.value.entity.isFetching,
		details: data.value.details.isFetching,
		refs: data.value.details.isFetching,
	};
});

const labelCols = ["name", "start_date", "end_date"];
const relCols = ["relation_type", "target.name", "start_date", "end_date"];

const title = computed(() => {
	if (!loading.value.entity) {
		return `${data.value.entity.data.fullname} - ${t("pages.searchviews.people.sing")}`;
	}

	return t("pages.searchviews.people.sing");
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
			(data.details.isLoadingError || data.entity.isLoadingError)
		"
	>
		<div>{{ data.entity.error }}</div>
		<div>{{ data.details.error }}</div>
	</div>
	<DetailPage v-else :details-loading="loading.details" model="Person">
		<template #head>
			<div class="font-bold text-primary-600 xl:my-2 xl:text-4xl">
				<div
					v-if="!loading.entity && data.entity.data"
					class="mb-4 flex flex-col justify-between gap-4 md:m-0 md:flex-row md:items-center md:gap-8"
				>
					<h1 class="text-4xl">
						{{ data.entity.data?.fullname }}
					</h1>
					<div class="flex items-center gap-2">
						<Indicator
							class="w-24"
							:status="data.entity.data?.ampel"
							:title="t('collection-keys.viecpro_persons.ampel')"
						/>
						<InfoMenu class="text-base font-normal">
							<template #button>
								<button
									class="rounded-full transition hover:bg-slate-200 active:bg-slate-300"
									:title="t('collection-keys.viecpro_persons.notes')"
								>
									<span class="sr-only">{{ t("collection-keys.viecpro_courts.sources") }}</span>
									<StickyNote class="m-2 size-6 shrink-0" />
								</button>
							</template>
							<template #content>
								<div v-if="data.details.data.notes">
									{{ data.details.data.notes }}
								</div>
								<div v-else class="italic">
									{{ t("collection-keys.viecpro_persons.no-notes") }}
								</div>
							</template>
						</InfoMenu>
						<HierarchyLinkButton
							:id="String(data.entity.data?.object_id)"
							:label="data.entity.data?.fullname"
							model="Person"
							:title="t('collection-keys.viecpro_persons.hierarchy')"
						/>
						<InfoMenu>
							<template #button>
								<button
									class="rounded-full transition hover:bg-slate-200 active:bg-slate-300"
									:title="t('collection-keys.viecpro_persons.citations')"
								>
									<span class="sr-only">Show Infos</span>
									<Info class="m-2 size-6 shrink-0" />
								</button>
							</template>
							<template #content>
								<div class="text-base font-normal text-black">
									<div>{{ t("detail-page.basedata") }} - Person</div>
									<div>
										{{ data.entity.data?.fullname }}
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
			<span>{{ t("collection-keys.viecpro_persons.first_name") }}:</span>
			<span v-if="!loading.entity">{{ data.entity.data?.first_name }}</span>
			<span v-else class="animate-pulse">{{ t("ui.loading") }}</span>
			<div class="col-span-2 my-1 border-t"></div>
			<template v-if="!loading.entity">
				<template v-if="data.entity.data?.name">
					<span v-if="data.entity.data.gender === 'male'">Name:</span>
					<span v-else>{{ t("collection-keys.viecpro_persons.maiden_name") }}:</span>
				</template>

				<span>{{ data.entity.data?.name }}</span>
			</template>
			<template v-else>
				<span class="animate-pulse">{{ t("ui.loading") }}</span>
				<div class="col-span-2 my-1 border-t"></div>
			</template>
			<template v-if="!loading.details">
				<template v-if="data.details.data?.married_names?.length">
					<div class="col-span-2 my-1 border-t"></div>
					<span>{{ t("collection-keys.viecpro_persons.married_names") }}:</span>
					<div>
						<div v-for="name in data.details.data.married_names" :key="name.name">
							{{ name.name }}
						</div>
					</div>
				</template>
			</template>
			<span v-else class="animate-pulse">{{ t("ui.loading") }}</span>
			<div class="col-span-2 my-1 border-t"></div>

			<span>{{ t("collection-keys.viecpro_persons.born") }}:</span>
			<template v-if="!loading.entity">
				<span>
					{{ data.entity.data?.start_date }}
					<span v-if="!isEmpty(data.details.data?.place_of_birth)">
						in {{ data.details.data?.place_of_birth.name }}
					</span>
				</span>
			</template>
			<span v-else class="animate-pulse">{{ t("ui.loading") }}</span>
			<div class="col-span-2 my-1 border-t"></div>

			<span>{{ t("collection-keys.viecpro_persons.died") }}:</span>
			<span>
				<template v-if="!loading.details && !loading.entity">
					<span>
						{{ data.entity.data?.end_date }}
						<span v-if="!isEmpty(data.details.data?.place_of_death)">
							in {{ data.details.data?.place_of_death.name }}
						</span>
					</span>
				</template>
				<span v-else class="animate-pulse">{{ t("ui.loading") }}</span>
			</span>
			<div class="col-span-2 my-1 border-t"></div>
			<span>{{ t("collection-keys.viecpro_persons.gender") }}:</span>
			<span v-if="!loading.entity">{{ data.entity.data?.gender }}</span>
			<span v-else class="animate-pulse">{{ t("ui.loading") }}</span>
			<div class="col-span-2 my-1 border-t"></div>
			<span>{{ t("collection-keys.viecpro_persons.confession") }}:</span>
			<span v-if="!loading.details">
				<div v-for="confession in data.details.data?.confession" :key="confession">
					{{ confession }}
				</div>
			</span>
			<span v-else class="animate-pulse">{{ t("ui.loading") }}</span>
		</template>
		<template #left>
			<div v-if="data.details.data" class="flex flex-col gap-3">
				<DetailDisclosure
					:collection-name="collection"
					grid-class="grid-cols-1"
					:headers="['target.name']"
					link-to
					:loading="loading.details"
					:rels="data.details.data?.duplicates || []"
					:title="t('collection-keys.viecpro_persons.duplicates')"
				/>
				<!-- dont judge me -->
				<GenericDisclosure
					:disabled="
						isEmpty([
							...data.details.data?.alternative_first_names,
							...data.details.data?.alternative_last_names,
						])
					"
					:title="t('collection-keys.viecpro_persons.alternativenames')"
				>
					<div class="grid gap-2 p-2">
						<div v-if="!isEmpty(data.details.data.alternative_first_names)">
							<div class="font-semibold">
								{{ t("collection-keys.viecpro_persons.alternative_first_names") }}
							</div>
							<div
								v-for="name in data.details.data.alternative_first_names"
								:key="name"
								class="border-t p-1 pl-0"
							>
								{{ name }}
							</div>
						</div>
						<div v-if="!isEmpty(data.details.data.alternative_last_names)">
							<div class="font-semibold">
								{{ t("collection-keys.viecpro_persons.alternative_last_names") }}
							</div>
							<div
								v-for="name in data.details.data.alternative_last_names"
								:key="name"
								class="border-t p-1 pl-0"
							>
								{{ name }}
							</div>
						</div>
					</div>
				</GenericDisclosure>
				<DetailDisclosure
					collection-name="generic"
					grid-class="grid-cols-3"
					:headers="labelCols"
					:rels="data.details.data.honorary_titles"
					:title="t('collection-keys.viecpro_persons.honorary_titles')"
				/>
				<DetailDisclosure
					collection-name="generic"
					grid-class="grid-cols-3"
					:headers="labelCols"
					:rels="data.details.data.academic_titles"
					:title="t('collection-keys.viecpro_persons.academic_titles')"
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
				<!-- <DetailDisclosure
					title="Download und Zitierweise"
					:rels="[]"
					:headers="[]"
					:collection-name="collection"
				/> -->
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
				<h2 class="text-2xl text-gray-500">{{ t("detail-page.courtrelated") }}</h2>
				<DetailDisclosure
					collection-name="functions"
					default-open
					grid-class="grid-cols-4"
					:headers="relCols"
					link-to
					:rels="data.details.data.court_functions"
					:title="t('collection-keys.viecpro_persons.court_functions')"
				/>
				<DetailDisclosure
					collection-name="generic"
					grid-class="grid-cols-4"
					:headers="relCols"
					link-to
					:rels="data.details.data.person_relations_court"
					:title="t('collection-keys.viecpro_persons.person_relations_court')"
				/>
				<DetailDisclosure
					collection-name="generic"
					grid-class="grid-cols-3"
					:headers="labelCols"
					:rels="data.details.data.other_relations_court"
					:title="t('collection-keys.viecpro_persons.other_relations_court')"
				/>
				<GenericDisclosure
					:disabled="
						isEmpty(data.details.data.allowance) || isEmpty(data.details.data.allowance[0])
					"
					:title="t('collection-keys.viecpro_persons.allowance')"
				>
					<div class="p-2">
						<div
							v-for="allowance in data.details.data.allowance"
							:key="allowance"
							class="border-t p-1 pl-0 first:border-0"
						>
							{{ allowance }}
						</div>
					</div>
				</GenericDisclosure>
				<h2 class="text-2xl text-gray-500">{{ t("detail-page.additional") }}</h2>
				<DetailDisclosure
					collection-name="place_person"
					grid-class="grid-cols-4"
					:headers="relCols"
					link-to
					:rels="data.details.data.related_places"
					:title="t('detail-page.related_places')"
				/>
				<DetailDisclosure
					collection-name="generic"
					grid-class="grid-cols-4"
					:headers="relCols"
					link-to
					:rels="data.details.data.marriages_and_family_relations"
					:title="t('collection-keys.viecpro_persons.marriages_and_family_relations')"
				/>
				<DetailDisclosure
					collection-name="generic"
					grid-class="grid-cols-3"
					:headers="labelCols"
					:rels="data.details.data.relations_to_church_and_orders"
					:title="t('collection-keys.viecpro_persons.relations_to_church_and_orders')"
				/>
				<DetailDisclosure
					collection-name="generic"
					grid-class="grid-cols-3"
					:headers="['relation_type', 'start_date', 'end_date']"
					:rels="data.details.data.non_court_functions"
					:title="t('collection-keys.viecpro_persons.non_court_functions')"
				/>
			</div>
			<div v-else>{{ t("ui.no-data") }}.</div>
		</template>
	</DetailPage>
</template>
