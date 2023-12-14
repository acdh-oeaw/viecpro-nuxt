<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { Loader2 } from "lucide-vue-next";
import { useRoute } from "vue-router";

import Chip from "@/components/chip.vue";
import DetailPage from "@/components/detail-page.vue";
// import DetailDisclosure from "@/components/detail-disclosure.vue";
import type { Institution, InstitutionDetail } from "@/types/schema";
import { definePageMeta, getDetails, getDocument, ref } from "#imports";

const t = useTranslations();

const route = useRoute();
const id = String(route.params.id);

const data = ref({
	entity: useQuery({
		queryKey: ["viecpro_institutions", id],
		queryFn: () => getDocument<Institution>("viecpro_institutions", `Institution_${id}`),
	}),
	details: useQuery({
		queryKey: ["detail", "viecpro_institutions", id],
		queryFn: () => getDetails<InstitutionDetail>("institution", id),
	}),
});

const loading = {
	entity: computed(() => data.value.entity.isFetching),
	details: computed(() => data.value.details.isFetching),
};

definePageMeta({
	title: "pages.searchviews.institutions.title",
});
</script>

<template>
	<DetailPage model="Institution">
		<template #head>
			<h1 class="text-2xl font-bold text-primary-600 xl:my-2 xl:text-4xl">
				<span v-if="!loading.entity.value">
					{{ data.entity.data?.name }}
				</span>
				<span v-else class="animate-pulse">{{ t("ui.loading") }}</span>
			</h1>
			<Chip
				v-if="loading.details.value || data.details.data?.locations.length !== 0"
				class="my-1 text-sm lg:text-base"
				square
			>
				<template v-if="!loading.details.value">
					<span v-if="data.details.data">
						{{
							data.details.data.locations
								.map((func) => func.target.name)
								.slice(0, 3)
								.join(" - ")
						}}
					</span>
					<span v-if="data.details.data?.locations && data.details.data?.locations.length > 3">
						+
						{{ data.details.data.locations.length - 3 }}
					</span>
				</template>
				<span v-else>
					<Loader2 class="h-5 w-5 animate-spin" />
				</span>
			</Chip>
		</template>
		<template #base>
			<div class="col-span-2 my-1 border-t"></div>
			<span>{{ t("collection-keys.name") }}:</span>
			<span v-if="!loading.entity.value">{{ data.entity.data?.name }}</span>
			<span v-else class="animate-pulse">{{ t("ui.loading") }}</span>
			<div class="col-span-2 my-1 border-t"></div>

			<span>{{ t("detail-page.runtime") }}:</span>
			<span v-if="!loading.entity.value">
				{{ data.entity.data?.start_date }} - {{ data.entity.data?.end_date }}
			</span>
			<span v-else class="animate-pulse">{{ t("ui.loading") }}</span>
			<div class="col-span-2 my-1 border-t"></div>

			<span>{{ t("collection-keys.category") }}:</span>
			<span v-if="!loading.details.value">{{ data.details.data?.category }}</span>
			<span v-else class="animate-pulse">{{ t("ui.loading") }}</span>
			<div class="col-span-2 my-1 border-t"></div>

			<span>{{ t("collection-keys.resolution") }}:</span>
			<span v-if="!loading.details.value">{{ data.details.data?.resolution }}</span>
			<span v-else class="animate-pulse">{{ t("ui.loading") }}</span>
			<div class="col-span-2 my-1 border-t"></div>
		</template>
		<template #left>
			<div v-if="!loading.details.value">
				<div v-if="data.details.data" class="flex flex-col gap-3">
					<DetailDisclosure
						:title="t('collection-keys.alternative_names')"
						:rels="data.details.data.alternative_names"
						:headers="['name', 'start_date', 'end_date']"
						grid-class="grid-cols-3"
						:loading="loading.details.value"
					/>
					<DetailDisclosure
						:title="t('collection-keys.sources')"
						:rels="data.details.data.sources"
						:headers="['sources.bibtex.title', 'sources.bibtex.type', 'sources.folio']"
						grid-class="grid-cols-3"
						:loading="loading.details.value"
					/>
				</div>
				<div v-else>No data.</div>
			</div>
			<Centered v-else>
				<Loader2 class="h-8 w-8 animate-spin" />
			</Centered>
		</template>
		<template #right>
			<div v-if="!loading.details.value">
				<div v-if="data.details.data" class="flex flex-col gap-3">
					<DetailDisclosure
						default-open
						:title="t('collection-keys.personnel')"
						:headers="['relation_type', 'target.name']"
						:rels="data.details.data.personnel"
						grid-class="grid-cols-2"
					/>
					<DetailDisclosure
						:title="t('collection-keys.locations')"
						:headers="['relation_type', 'target.name']"
						:rels="data.details.data.locations"
						grid-class="grid-cols-2"
					/>
					<DetailDisclosure
						:title="t('collection-keys.hierarchy')"
						:headers="['relation_type', 'target.name']"
						:rels="data.details.data.hierarchy"
						grid-class="grid-cols-2"
					/>
				</div>
				<div v-else>No data.</div>
			</div>
			<Centered v-else>
				<Loader2 class="h-8 w-8 animate-spin" />
			</Centered>
		</template>
	</DetailPage>
</template>
