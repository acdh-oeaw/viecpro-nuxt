<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { Loader2 } from "lucide-vue-next";
import { useRoute } from "vue-router";

import Chip from "@/components/chip.vue";
import DetailDisclosure from "@/components/detail-disclosure.vue";
import DetailPage from "@/components/detail-page.vue";
import type { Court, CourtDetail } from "@/types/schema";
import { definePageMeta, getDetails, getDocument, ref } from "#imports";

const t = useTranslations();

const route = useRoute();
const id = String(route.params.id);

const data = ref({
	entity: useQuery({
		queryKey: ["viecpro_courts", id],
		queryFn: () => getDocument<Court>("viecpro_courts", `Hofstaat_${id}`),
	}),
	details: useQuery({
		queryKey: ["detail", "viecpro_places", id],
		queryFn: () => getDetails<CourtDetail>("institution", id),
	}),
});

const loading = computed(() => ({
	entity: data.value.entity.isLoading,
	details: data.value.details.isLoading,
}));

const relCols = ["relation_type", "target.name", "start_date", "end_date"];

definePageMeta({
	title: "pages.searchviews.courts.title",
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
	<DetailPage v-else :model="t('pages.searchviews.courts.sing')" :details-loading="loading.details">
		<template #head>
			<h1 class="text-2xl font-bold text-primary-600 xl:my-2 xl:text-4xl">
				<span v-if="!loading.entity">
					{{ data.entity.data?.name }}
				</span>
				<span v-else class="animate-pulse">{{ t("ui.loading") }}</span>
			</h1>
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
						{{ data.details.data.alternative_names.slice(0, 3).join(" - ") }}
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
					<Loader2 class="h-5 w-5 animate-spin" />
				</span>
			</Chip>
		</template>
		<template #base>
			<div class="col-span-2 my-1 border-t"></div>
			<span>{{ t("collection-keys.name") }}:</span>
			<span v-if="!loading.entity">{{ data.entity.data?.name }}</span>
			<span v-else class="animate-pulse">{{ t("ui.loading") }}</span>
			<div class="col-span-2 my-1 border-t"></div>
			<span>{{ t("collection-keys.resolution") }}:</span>
			<span v-if="!loading.details">{{ data.details.data?.resolution }}</span>
			<span v-else class="animate-pulse">{{ t("ui.loading") }}</span>
			<div class="col-span-2 my-1 border-t"></div>
			<span>{{ t("collection-keys.category") }}:</span>
			<span v-if="!loading.details">{{ data.details.data?.category }}</span>
			<span v-else class="animate-pulse">{{ t("ui.loading") }}</span>
			<div class="col-span-2 my-1 border-t"></div>
			<span>{{ t("detail-page.runtime") }}:</span>
			<span v-if="!loading.entity"
				>{{ data.entity.data?.start_date }} - {{ data.entity.data?.end_date }}</span
			>
			<span v-else class="animate-pulse">{{ t("ui.loading") }}</span>
			<div class="col-span-2 my-1 border-t"></div>
			<span>{{ t("collection-keys.id") }}:</span>
			<span v-if="!loading.entity">{{ data.entity.data?.id }}</span>
			<span v-else class="animate-pulse">{{ t("ui.loading") }}</span>
			<div class="col-span-2 my-1 border-t"></div>
		</template>
		<template #left>
			<div v-if="data.details.data" class="flex flex-col gap-3">
				<DetailDisclosure
					:title="t('collection-keys.alternative_names')"
					:rels="data.details.data?.alternative_names"
					:headers="['name']"
					grid-class="grid-cols-1"
					:loading="loading.details"
				/>
				<DetailDisclosure :title="t('collection-keys.download')" :rels="[]" :headers="[]" />
				<DetailDisclosure
					:title="t('collection-keys.sources')"
					:rels="[]"
					:headers="[]"
					grid-class="grid-cols-1"
					:loading="loading.details"
				/>
			</div>
			<div v-else>{{ t("ui.no-data") }}.</div>
		</template>
		<template #right>
			<div v-if="data.details.data" class="flex flex-col gap-3">
				<h2 class="text-2xl text-gray-500">{{ t("detail-page.relations") }}</h2>
				<DetailDisclosure
					default-open
					:title="t('collection-keys.owners')"
					:headers="relCols"
					:rels="data.details.data.owners || []"
					grid-class="grid-cols-4"
					:loading="loading.details"
				/>
				<DetailDisclosure
					:title="t('collection-keys.personnel')"
					:rels="data.details.data.personnel"
					:headers="relCols"
					grid-class="grid-cols-4"
					:loading="loading.details"
				/>
				<DetailDisclosure
					:title="t('collection-keys.locations')"
					:rels="data.details.data.locations"
					:headers="relCols"
					grid-class="grid-cols-4"
					:loading="loading.details"
				/>
				<DetailDisclosure
					:title="t('collection-keys.hierarchy')"
					:rels="data.details.data.hierarchy"
					:headers="relCols"
					grid-class="grid-cols-4"
					:loading="loading.details"
				/>
			</div>
			<div v-else>{{ t("ui.no-data") }}.</div>
		</template>
	</DetailPage>
</template>
