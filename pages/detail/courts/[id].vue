<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";
import { useQuery } from "@tanstack/vue-query";
import { Download, Info, Loader2 } from "lucide-vue-next";
import { useRoute } from "vue-router";

import Chip from "@/components/chip.vue";
import DetailDisclosure from "@/components/detail-disclosure.vue";
import DetailPage from "@/components/detail-page.vue";
import Indicator from "@/components/indicator.vue";
import { downloadAsJson } from "@/lib/helpers";
import type { Court, CourtDetail } from "@/types/schema";
import { definePageMeta, getDetails, getDocument, ref } from "#imports";

const t = useTranslations();

const route = useRoute();
const id = String(route.params.id);

const collection = "viecpro_courts";

const data = ref({
	entity: useQuery({
		queryKey: [collection, id],
		queryFn: () => getDocument<Court>(collection, `Hofstaat_${id}`),
	}),
	details: useQuery({
		queryKey: ["detail", collection, id],
		queryFn: () => getDetails<CourtDetail>("court", id, "institution"),
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
			<h1 class="w-full text-2xl font-bold text-primary-600 xl:my-2 xl:text-4xl">
				<div
					v-if="!loading.entity && data.entity.data"
					class="flex items-center justify-between gap-8"
				>
					<span>
						{{ data.entity.data?.name }}
					</span>
					<div class="flex items-center gap-2 leading-none">
						<Indicator :status="data.entity.data?.ampel" />
						<Popover class="relative">
							<PopoverButton
								as="button"
								class="rounded-full hover:bg-slate-200 active:bg-slate-300"
							>
								<span class="sr-only">Show Infos</span>
								<Info class="m-2 h-6 w-6 shrink-0" />
							</PopoverButton>
							<Transition
								enter-active-class="transition duration-200 ease-out"
								enter-from-class="translate-y-1 opacity-0"
								enter-to-class="translate-y-0 opacity-100"
								leave-active-class="transition duration-150 ease-in"
								leave-from-class="translate-y-0 opacity-100"
								leave-to-class="translate-y-1 opacity-0"
							>
								<PopoverPanel class="absolute right-0 z-10">
									<div
										class="min-w-96 rounded border bg-white p-2 text-base font-normal text-black"
									>
										<div>
											{{ t("detail-page.basedata") }} - {{ t("pages.searchviews.courts.sing") }}
										</div>
										<div>
											{{ data.entity.data?.name }}
										</div>
										<div>VieCPro-ID: {{ data.entity.data?.id }}</div>
									</div>
								</PopoverPanel>
							</Transition>
						</Popover>
						<button
							class="rounded-full hover:bg-slate-200 active:bg-slate-300"
							@click="
								downloadAsJson(
									{ entity: data.entity.data, details: data.details.data },
									String(data.entity.data?.name),
								)
							"
						>
							<span class="sr-only">Download</span>
							<Download class="m-2 h-6 w-6 shrink-0" />
						</button>
					</div>
				</div>
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
			<span>{{ t("collection-keys.viecpro_courts.name") }}:</span>
			<span v-if="!loading.entity">{{ data.entity.data?.name }}</span>
			<span v-else class="animate-pulse">{{ t("ui.loading") }}</span>
			<div class="col-span-2 my-1 border-t"></div>
			<span>{{ t("collection-keys.viecpro_courts.resolution") }}:</span>
			<span v-if="!loading.details">{{ data.details.data?.resolution }}</span>
			<span v-else class="animate-pulse">{{ t("ui.loading") }}</span>
			<div class="col-span-2 my-1 border-t"></div>
			<span>{{ t("collection-keys.viecpro_courts.category") }}:</span>
			<span v-if="!loading.details">{{ data.details.data?.category }}</span>
			<span v-else class="animate-pulse">{{ t("ui.loading") }}</span>
			<div class="col-span-2 my-1 border-t"></div>
			<span>{{ t("detail-page.runtime") }}:</span>
			<span v-if="!loading.entity"
				>{{ data.entity.data?.start_date }} - {{ data.entity.data?.end_date }}</span
			>
			<span v-else class="animate-pulse">{{ t("ui.loading") }}</span>
			<div class="col-span-2 my-1 border-t"></div>
			<span>{{ t("collection-keys.viecpro_courts.id") }}:</span>
			<span v-if="!loading.entity">{{ data.entity.data?.id }}</span>
			<span v-else class="animate-pulse">{{ t("ui.loading") }}</span>
			<div class="col-span-2 my-1 border-t"></div>
		</template>
		<template #left>
			<div v-if="data.details.data" class="flex flex-col gap-3">
				<DetailDisclosure
					:title="t('collection-keys.viecpro_courts.alternative_names')"
					:rels="data.details.data?.alternative_names"
					:headers="['name']"
					grid-class="grid-cols-1"
					:loading="loading.details"
					:collection-name="collection"
				/>
				<!-- <DetailDisclosure
					:title="t('collection-keys.viecpro_courts.download')"
					:collection-name="collection"
					:rels="[]"
					:headers="[]"
				/> -->
				<DetailDisclosure
					:title="t('collection-keys.viecpro_courts.sources')"
					:rels="[]"
					:headers="[]"
					grid-class="grid-cols-1"
					:loading="loading.details"
					:collection-name="collection"
				/>
			</div>
			<div v-else>{{ t("ui.no-data") }}.</div>
		</template>
		<template #right>
			<div v-if="data.details.data" class="flex flex-col gap-3">
				<h2 class="text-2xl text-gray-500">{{ t("detail-page.relations") }}</h2>
				<DetailDisclosure
					default-open
					:title="t('collection-keys.viecpro_courts.owners')"
					:headers="relCols"
					:rels="data.details.data.owners || []"
					grid-class="grid-cols-4"
					:loading="loading.details"
					:collection-name="collection"
					link-to
				/>
				<DetailDisclosure
					:title="t('collection-keys.viecpro_courts.personnel')"
					:rels="data.details.data.personnel"
					:headers="relCols"
					grid-class="grid-cols-4"
					:collection-name="collection"
					:loading="loading.details"
					link-to
				/>
				<DetailDisclosure
					:title="t('collection-keys.viecpro_courts.locations')"
					:rels="data.details.data.locations"
					:headers="relCols"
					grid-class="grid-cols-4"
					:loading="loading.details"
					:collection-name="collection"
					link-to
				/>
				<DetailDisclosure
					:title="t('collection-keys.viecpro_courts.hierarchy')"
					:rels="data.details.data.hierarchy"
					:headers="relCols"
					grid-class="grid-cols-4"
					:loading="loading.details"
					:collection-name="collection"
					link-to
				/>
			</div>
			<div v-else>{{ t("ui.no-data") }}.</div>
		</template>
	</DetailPage>
</template>
