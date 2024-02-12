<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { Loader2 } from "lucide-vue-next";
import { useRoute } from "vue-router";

import Chip from "@/components/chip.vue";
import DetailDisclosure from "@/components/detail-disclosure.vue";
import DetailPage from "@/components/detail-page.vue";
import MapComponent from "@/components/map-component.vue";
import type { Place, PlaceDetail } from "@/types/schema";
import { definePageMeta, getDetails, getDocument, ref } from "#imports";

const t = useTranslations();

const route = useRoute();
const id = String(route.params.id);

const collection = "viecpro_places";

const data = ref({
	entity: useQuery({
		queryKey: [collection, id],
		queryFn: () => getDocument<Place>(collection, `Place_${id}`),
	}),
	details: useQuery({
		queryKey: ["detail", collection, id],
		queryFn: () => getDetails<PlaceDetail>("place", id),
	}),
});

const loading = computed(() => ({
	entity: data.value.entity.isLoading,
	details: data.value.details.isLoading,
}));

const relCols = ["relation_type", "target.name", "start", "end"];

definePageMeta({
	title: "pages.searchviews.places.title",
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
	<DetailPage v-else :model="t('pages.searchviews.places.sing')" :details-loading="loading.details">
		<template #head>
			<h1 class="text-2xl font-bold text-primary-600 xl:my-2 xl:text-4xl">
				<span v-if="!loading.entity">
					{{ data.entity.data?.name }}
				</span>
				<span v-else class="animate-pulse">{{ t("ui.loading") }}</span>
			</h1>
			<Chip
				v-if="loading.details || data.details.data?.institution_relations.length !== 0"
				class="my-1 text-sm lg:text-base"
				square
			>
				<template v-if="!loading.details">
					<span v-if="data.details.data">
						{{
							data.details.data.institution_relations
								.map((func) => func.target.name)
								.slice(0, 3)
								.join(" - ")
						}}
					</span>
					<span
						v-if="
							data.details.data?.institution_relations &&
							data.details.data?.institution_relations.length > 3
						"
					>
						+
						{{ data.details.data.institution_relations.length - 3 }}
					</span>
				</template>
				<span v-else>
					<Loader2 class="h-5 w-5 animate-spin" />
				</span>
			</Chip>
		</template>
		<template #base>
			<div class="col-span-2 my-1 border-t"></div>
			<span>{{ t("collection-keys.viecpro_places.name") }}:</span>
			<span v-if="!loading.entity">{{ data.entity.data?.name }}</span>
			<span v-else class="animate-pulse">{{ t("ui.loading") }}</span>
			<div class="col-span-2 my-1 border-t"></div>
			<span>{{ t("collection-keys.viecpro_places.kind") }}:</span>
			<span v-if="!loading.entity">{{ data.entity.data?.kind }}</span>
			<span v-else class="animate-pulse">{{ t("ui.loading") }}</span>
			<div class="col-span-2 my-1 border-t"></div>
			<span>{{ t("detail-page.coords") }}:</span>
			<span v-if="!loading.entity">{{ data.entity.data?.lat }} - {{ data.entity.data?.long }}</span>
			<span v-else class="animate-pulse">{{ t("ui.loading") }}</span>
			<div class="col-span-2 my-1 border-t"></div>
		</template>
		<template #left>
			<div v-if="data.details.data || data.entity.data" class="flex flex-col gap-3">
				<DetailDisclosure
					v-if="data.details.data"
					:title="t('collection-keys.viecpro_places.alternative_names')"
					:rels="data.details.data?.alternative_names.map((name) => ({ name })) || []"
					:headers="['name']"
					grid-class="grid-cols-1"
					:loading="loading.details"
					:collection-name="collection"
				/>
				<GenericDisclosure
					title="Map"
					default-open
					:disabled="!data.entity.data?.lat || !data.entity.data?.long"
				>
					<MapComponent
						v-if="!loading.entity && data.entity.data?.lat && data.entity.data.long"
						class="h-96 w-full"
						:point="{ lat: data.entity.data.lat, long: data.entity.data.long }"
					/>
				</GenericDisclosure>
			</div>
			<div v-else>{{ t("ui.no-data") }}.</div>
		</template>
		<template #right>
			<div v-if="data.details.data" class="flex flex-col gap-3">
				<h2 class="text-2xl text-gray-500">{{ t("detail-page.relations") }}</h2>
				<DetailDisclosure
					default-open
					:title="t('collection-keys.viecpro_places.institution_relations')"
					:headers="relCols"
					:rels="data.details.data.institution_relations"
					grid-class="grid-cols-4"
					:collection-name="collection"
					link-to
				/>
				<DetailDisclosure
					:title="t('collection-keys.viecpro_places.person_relations')"
					:rels="data.details.data.person_relations"
					:headers="relCols"
					grid-class="grid-cols-4"
					:collection-name="collection"
					link-to
				/>
				<DetailDisclosure
					:title="t('collection-keys.viecpro_places.place_relations')"
					:rels="data.details.data.place_relations"
					:headers="relCols"
					grid-class="grid-cols-4"
					:collection-name="collection"
					link-to
				/>
			</div>
			<div v-else>{{ t("ui.no-data") }}.</div>
		</template>
	</DetailPage>
</template>
