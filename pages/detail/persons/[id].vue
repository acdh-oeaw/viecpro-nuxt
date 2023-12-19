<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { isEmpty } from "lodash";
import { Loader2 } from "lucide-vue-next";
import { useRoute } from "vue-router";

import Chip from "@/components/chip.vue";
import DetailDisclosure from "@/components/detail-disclosure.vue";
import DetailPage from "@/components/detail-page.vue";
import type { Person, PersonDetail } from "@/types/schema";
import { definePageMeta, getDetails, getDocument, ref } from "#imports";

const t = useTranslations();

const route = useRoute();
const id = String(route.params.id);

const data = ref({
	entity: useQuery({
		queryKey: ["viecpro_persons", id],
		queryFn: () => getDocument<Person>("viecpro_persons", `Person_${id}`),
	}),
	details: useQuery({
		queryKey: ["detail", "viecpro_persons", id],
		queryFn: () => getDetails<PersonDetail>("person", id),
	}),
});

const loading = {
	entity: computed(() => data.value.entity.isLoading),
	details: computed(() => data.value.details.isLoading),
};

const labelCols = ["name", "start_date", "end_date"];
const relCols = ["relation_type", "target.name", "start_date", "end_date"];

definePageMeta({
	title: "pages.searchviews.people.title",
});
</script>

<template>
	<DetailPage model="Person" :details-loading="loading.details.value">
		<template #head>
			<h1 class="text-2xl font-bold text-primary-600 xl:my-2 xl:text-4xl">
				<span v-if="!loading.entity.value">
					{{ data.entity.data?.fullname }}
				</span>
				<span v-else class="animate-pulse">{{ t("ui.loading") }}</span>
			</h1>
			<Chip
				v-if="loading.details.value || data.details.data?.court_functions.length !== 0"
				class="my-1 text-sm lg:text-base"
				square
			>
				<template v-if="!loading.details.value">
					<span v-if="data.details.data">
						{{
							data.details.data.court_functions
								.map((func) => func.relation_type)
								.slice(0, 3)
								.join(" - ")
						}}
					</span>
					<span
						v-if="
							data.details.data?.court_functions && data.details.data?.court_functions.length > 3
						"
					>
						+
						{{ data.details.data.court_functions.length - 3 }}
					</span>
				</template>
				<span v-else>
					<Loader2 class="h-5 w-5 animate-spin" />
				</span>
			</Chip>
		</template>
		<template #base>
			<div class="col-span-2 my-1 border-t"></div>
			<span>{{ t("collection-keys.first_name") }}:</span>
			<span v-if="!loading.entity.value">{{ data.entity.data?.first_name }}</span>
			<span v-else class="animate-pulse">{{ t("ui.loading") }}</span>
			<div class="col-span-2 my-1 border-t"></div>
			<template v-if="!loading.entity.value">
				<template v-if="data.entity.data?.name">
					<span v-if="data.entity.data.gender === 'male'">Name:</span>
					<span v-else>{{ t("collection-keys.maiden_name") }}:</span>
				</template>

				<span>{{ data.entity.data?.name }}</span>
			</template>
			<template v-else>
				<span class="animate-pulse">{{ t("ui.loading") }}</span>
				<div class="col-span-2 my-1 border-t"></div>
			</template>
			<template v-if="!loading.details.value">
				<template v-if="data.details.data?.married_names?.length">
					<span>{{ t("collection-keys.married_names") }}:</span>
					<div>
						<div v-for="name in data.details.data.married_names" :key="name.name">
							{{ name.name }}
						</div>
					</div>
					<div class="col-span-2 my-1 border-t"></div>
				</template>
			</template>
			<div v-else class="col-span-2 flex justify-center border-b pb-1">
				<Loader2 class="h-5 w-5 animate-spin" />
			</div>
			<div class="col-span-2 my-1 border-t"></div>

			<span>{{ t("collection-keys.born") }}:</span>
			<template v-if="!loading.entity.value">
				<span>
					{{ data.entity.data?.start_date }}
					<span v-if="!isEmpty(data.details.data?.place_of_birth)">
						in {{ data.details.data?.place_of_birth.name }}
					</span>
				</span>
			</template>
			<span v-else class="animate-pulse">{{ t("ui.loading") }}</span>
			<div class="col-span-2 my-1 border-t"></div>

			<span>{{ t("collection-keys.died") }}:</span>
			<span>
				<template v-if="!loading.details.value && !loading.entity.value">
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
			<span>{{ t("collection-keys.gender") }}:</span>
			<span v-if="!loading.entity.value">{{ data.entity.data?.gender }}</span>
			<span v-else class="animate-pulse">{{ t("ui.loading") }}</span>
		</template>
		<template #left>
			<div v-if="data.details.data" class="flex flex-col gap-3">
				<DetailDisclosure
					:title="t('collection-keys.duplicates')"
					:rels="data.details.data?.duplicates || []"
					:headers="['name']"
					grid-class="grid-cols-1"
					:loading="loading.details.value"
				/>
				<!-- dont judge me -->
				<DetailDisclosure
					:title="t('collection-keys.alternative_last_names')"
					:rels="[]"
					:custom-slot="
						!isEmpty([
							...data.details.data?.alternative_first_names,
							...data.details.data?.alternative_last_names,
							...data.details.data?.married_names,
						])
					"
					grid-class="grid-cols-3"
				>
					<div class="grid gap-2">
						<div v-if="!isEmpty(data.details.data.alternative_first_names)">
							<div class="font-semibold">alternative_first_names</div>
							<div
								v-for="name in data.details.data.alternative_first_names"
								:key="name"
								class="border-t"
							>
								{{ name }}
							</div>
						</div>
						<div v-if="!isEmpty(data.details.data.alternative_last_names)">
							<div class="font-semibold">alternative_last_names</div>
							<div
								v-for="name in data.details.data.alternative_last_names"
								:key="name"
								class="border-t"
							>
								{{ name }}
							</div>
						</div>
						<div v-if="!isEmpty(data.details.data.married_names)">
							<div class="font-semibold">married_names</div>
							<div
								v-for="name in data.details.data.married_names"
								:key="name.name"
								class="border-t"
							>
								{{ name.name }}
							</div>
						</div>
					</div>
				</DetailDisclosure>
				<DetailDisclosure
					:title="t('collection-keys.honorary_titles')"
					:rels="data.details.data.honorary_titles"
					:headers="labelCols"
					grid-class="grid-cols-3"
				/>
				<DetailDisclosure
					:title="t('collection-keys.academic_titles')"
					:rels="data.details.data.academic_titles"
					:headers="labelCols"
					grid-class="grid-cols-3"
				/>
				<DetailDisclosure title="Download und Zitierweise" :rels="[]" :headers="[]" />
			</div>
			<div v-else>{{ t("ui.no-data") }}.</div>
		</template>
		<template #right>
			<div v-if="data.details.data" class="flex flex-col gap-3">
				<h2 class="text-2xl text-gray-500">{{ t("detail-page.courtrelated") }}</h2>
				<DetailDisclosure
					default-open
					:title="t('collection-keys.court_functions')"
					:headers="relCols"
					:rels="data.details.data.court_functions"
					grid-class="grid-cols-4"
				/>
				<DetailDisclosure
					:title="t('collection-keys.person_relations_court')"
					:rels="data.details.data.person_relations_court"
					:headers="relCols"
					grid-class="grid-cols-4"
				/>
				<DetailDisclosure
					:title="t('collection-keys.other_relations_court')"
					:rels="data.details.data.other_relations_court"
					:headers="labelCols"
					grid-class="grid-cols-3"
				/>
				<h2 class="text-2xl text-gray-500">{{ t("detail-page.additional") }}</h2>
				<DetailDisclosure
					:title="t('collection-keys.marriages_and_family_relations')"
					:rels="data.details.data.marriages_and_family_relations"
					:headers="relCols"
					grid-class="grid-cols-4"
				/>
				<DetailDisclosure
					:title="t('collection-keys.relations_to_church_and_orders')"
					:rels="data.details.data.relations_to_church_and_orders"
					:headers="relCols"
					grid-class="grid-cols-4"
				/>
				<DetailDisclosure
					:title="t('collection-keys.non_vourt_functions')"
					:rels="data.details.data.non_court_functions"
					:headers="relCols"
					grid-class="grid-cols-4"
				/>
			</div>
			<div v-else>{{ t("ui.no-data") }}.</div>
		</template>
	</DetailPage>
</template>
