<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { isEmpty } from "lodash-es";
import { Download, Loader2 } from "lucide-vue-next";
import { useRoute } from "vue-router";

import Chip from "@/components/chip.vue";
import DetailDisclosure from "@/components/detail-disclosure.vue";
import DetailPage from "@/components/detail-page.vue";
import { downloadAsJson } from "@/lib/helpers";
import type { Institution, InstitutionDetail } from "@/types/schema";
import { definePageMeta, getDetails, getDocument, ref } from "#imports";

const t = useTranslations();
const route = useRoute();

const id = String(route.params.id);

const collection = "viecpro_institutions";

const data = ref({
	entity: useQuery({
		queryKey: [collection, id],
		queryFn: () => getDocument<Institution>(collection, `Institution_${id}`),
	}),
	details: useQuery({
		queryKey: ["detail", collection, id],
		queryFn: () => getDetails<InstitutionDetail>("institution", id),
	}),
});

const loading = computed(() => ({
	entity: data.value.entity.isFetching,
	details: data.value.details.isFetching,
}));

definePageMeta({
	title: "pages.searchviews.institutions.title",
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
	<DetailPage v-else model="Institution" :details-loading="loading.details">
		<template #head>
			<h1 class="text-2xl font-bold text-primary-600 xl:my-2 xl:text-4xl">
				<div v-if="!loading.entity" class="flex items-center justify-between gap-8">
					<span>
						{{ data.entity.data?.name }}
					</span>
					<button
						class="cursor-pointer rounded-full hover:bg-slate-200 active:bg-slate-300"
						@click="
							downloadAsJson(
								{ entity: data.entity.data, details: data.details.data },
								String(data.entity.data?.name),
							)
						"
					>
						<span class="sr-only">Download</span>
						<Download class="m-2 h-6 w-6" />
					</button>
				</div>
				<span v-else class="animate-pulse">{{ t("ui.loading") }}</span>
			</h1>
			<Chip
				v-if="loading.details || data.details.data?.locations.length !== 0"
				class="my-1 text-sm lg:text-base"
				square
			>
				<template v-if="!loading.details">
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
			<span>{{ t("collection-keys.viecpro_institutions.name") }}:</span>
			<span v-if="!loading.entity">{{ data.entity.data?.name }}</span>
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

			<span>{{ t("collection-keys.viecpro_institutions.resolution") }}:</span>
			<span v-if="!loading.details">{{ data.details.data?.resolution }}</span>
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
					:disabled="isEmpty(data.details.data.sources)"
				>
					<div v-if="!isEmpty(data.details.data.sources)">
						<template v-for="(source, i) in data.details.data.sources" :key="source.id">
							<div v-if="i != 0" class="my-1 border" />
							<div v-if="source" class="flex flex-col gap-1 p-2">
								<h3 class="border-b">
									{{ source.bibtex.title || source.bibtex.shortTitle }}
								</h3>
								<span>{{ source.folio }}</span>
								<span class="text-sm text-gray-400">{{ source.bibtex.id }}</span>
							</div>
						</template>
					</div>
				</GenericDisclosure>
			</div>
			<div v-else>No data.</div>
		</template>
		<template #right>
			<div v-if="data.details.data" class="flex flex-col gap-3">
				<DetailDisclosure
					default-open
					:title="t('collection-keys.viecpro_institutions.personnel')"
					:headers="['relation_type', 'target.name', 'start_date', 'end_date']"
					:rels="data.details.data.personnel"
					grid-class="grid-cols-4"
					:collection-name="collection"
					link-to
				/>
				<DetailDisclosure
					:title="t('collection-keys.viecpro_institutions.locations')"
					:headers="['relation_type', 'target.name']"
					:rels="data.details.data.locations"
					grid-class="grid-cols-2"
					:collection-name="collection"
					link-to
				/>
				<DetailDisclosure
					:title="t('collection-keys.viecpro_institutions.hierarchy')"
					:headers="['relation_type', 'target.name']"
					:rels="data.details.data.hierarchy"
					grid-class="grid-cols-2"
					:collection-name="collection"
					link-to
				/>
			</div>
			<div v-else>No data.</div>
		</template>
	</DetailPage>
</template>
