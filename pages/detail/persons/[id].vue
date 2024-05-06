<script setup lang="ts">
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { isEmpty } from "lodash-es";
import { ExternalLink, Info } from "lucide-vue-next";
import type { SearchResponse } from "typesense/lib/Typesense/Documents";
import { useRoute } from "vue-router";

import DetailDisclosure from "@/components/detail-disclosure.vue";
import DetailPage from "@/components/detail-page.vue";
import Indicator from "@/components/indicator.vue";
import type { Person, PersonDetail, Reference } from "@/types/schema";
import { definePageMeta, getDetails, getDocument, ref } from "#imports";

const t = useTranslations();
const queryClient = useQueryClient();
const route = useRoute();

const id = String(route.params.id);

const collection = "viecpro_persons";

const data = ref({
	entity: useQuery({
		queryKey: [collection, id],
		queryFn: () => getDocument<Person>(collection, `Person_${id}`),
	}),
	details: useQuery({
		queryKey: ["detail", collection, id],
		queryFn: () => getDetails<PersonDetail>("person", id),
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

const loading = computed(() => ({
	entity: data.value.entity.isFetching,
	details: data.value.details.isFetching,
	refs: data.value.details.isFetching,
}));

const labelCols = ["name", "start_date", "end_date"];
const relCols = ["relation_type", "target.name", "start_date", "end_date"];

definePageMeta({
	title: "pages.searchviews.people.title",
});

const title = computed(() => {
	if (data.value.entity.data?.name) return `${data.value.entity.data.fullname} - Person`;
	return "Person";
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
			(data.details.isLoadingError || data.entity.isLoadingError)
		"
	>
		<div>{{ data.entity.error }}</div>
		<div>{{ data.details.error }}</div>
	</div>
	<DetailPage v-else model="Person" :details-loading="loading.details">
		<template #head>
			<h1 class="font-bold text-primary-600 xl:my-2 xl:text-4xl">
				<div
					v-if="!loading.entity && data.entity.data"
					class="mb-4 flex flex-col justify-between gap-4 md:m-0 md:flex-row md:items-center md:gap-8"
				>
					<span class="text-4xl">
						{{ data.entity.data?.fullname }}
					</span>
					<div class="flex items-center gap-2">
						<Indicator class="w-24" :status="data.entity.data?.ampel" />
						<HierarchyLinkButton
							:id="String(data.entity.data?.object_id)"
							model="Person"
							:label="data.entity.data?.fullname"
						/>
						<InfoMenu>
							<template #button>
								<button class="rounded-full hover:bg-slate-200 active:bg-slate-300">
									<span class="sr-only">Show Infos</span>
									<Info class="m-2 h-6 w-6 shrink-0" />
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
						<DownloadMenu detail :data="data" :collection="collection" />
					</div>
				</div>
				<span v-else class="animate-pulse">{{ t("ui.loading") }}</span>
			</h1>
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
					:title="t('collection-keys.viecpro_persons.duplicates')"
					:rels="data.details.data?.duplicates || []"
					:headers="['target.name']"
					grid-class="grid-cols-1"
					:loading="loading.details"
					:collection-name="collection"
					link-to
				/>
				<!-- dont judge me -->
				<GenericDisclosure
					:title="t('collection-keys.viecpro_persons.alternativenames')"
					:disabled="
						isEmpty([
							...data.details.data?.alternative_first_names,
							...data.details.data?.alternative_last_names,
						])
					"
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
					:title="t('collection-keys.viecpro_persons.honorary_titles')"
					:rels="data.details.data.honorary_titles"
					:headers="labelCols"
					grid-class="grid-cols-3"
					collection-name="generic"
				/>
				<DetailDisclosure
					:title="t('collection-keys.viecpro_persons.academic_titles')"
					:rels="data.details.data.academic_titles"
					:headers="labelCols"
					grid-class="grid-cols-3"
					collection-name="generic"
				/>
				<GenericDisclosure
					:title="t('collection-keys.viecpro_courts.sources')"
					:disabled="!data.refs.data || isEmpty(data.refs.data.hits)"
				>
					<div v-if="data.refs.data">
						<template
							v-for="({ document: reference }, i) in data.refs.data.hits"
							:key="reference.id"
						>
							<div v-if="i !== 0" class="my-1 border" />
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
				<!-- <DetailDisclosure
					title="Download und Zitierweise"
					:rels="[]"
					:headers="[]"
					:collection-name="collection"
				/> -->
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
				<h2 class="text-2xl text-gray-500">{{ t("detail-page.courtrelated") }}</h2>
				<DetailDisclosure
					default-open
					:title="t('collection-keys.viecpro_persons.court_functions')"
					:headers="relCols"
					:rels="data.details.data.court_functions"
					grid-class="grid-cols-4"
					collection-name="functions"
					link-to
				/>
				<DetailDisclosure
					:title="t('collection-keys.viecpro_persons.person_relations_court')"
					:rels="data.details.data.person_relations_court"
					:headers="relCols"
					grid-class="grid-cols-4"
					collection-name="generic"
					link-to
				/>
				<DetailDisclosure
					:title="t('collection-keys.viecpro_persons.other_relations_court')"
					:rels="data.details.data.other_relations_court"
					:headers="labelCols"
					grid-class="grid-cols-3"
					:collection-name="collection"
				/>
				<GenericDisclosure
					:title="t('collection-keys.viecpro_persons.allowance')"
					:disabled="
						isEmpty(data.details.data.allowance) || isEmpty(data.details.data.allowance[0])
					"
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
					:title="t('detail-page.related_places')"
					:rels="data.details.data.related_places"
					:headers="relCols"
					grid-class="grid-cols-4"
					collection-name="place_person"
					link-to
				/>
				<DetailDisclosure
					:title="t('collection-keys.viecpro_persons.marriages_and_family_relations')"
					:rels="data.details.data.marriages_and_family_relations"
					:headers="relCols"
					grid-class="grid-cols-4"
					collection-name="generic"
					link-to
				/>
				<DetailDisclosure
					:title="t('collection-keys.viecpro_persons.relations_to_church_and_orders')"
					:rels="data.details.data.relations_to_church_and_orders"
					:headers="labelCols"
					grid-class="grid-cols-3"
					collection-name="generic"
				/>
				<DetailDisclosure
					:title="t('collection-keys.viecpro_persons.non_court_functions')"
					:rels="data.details.data.non_court_functions"
					:headers="relCols"
					grid-class="grid-cols-4"
					collection-name="generic"
					link-to
				/>
			</div>
			<div v-else>{{ t("ui.no-data") }}.</div>
		</template>
	</DetailPage>
</template>
