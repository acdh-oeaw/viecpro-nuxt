<script lang="ts" setup>
import { Loader2 } from "lucide-vue-next";

import SearchTable from "@/components/search-table.vue";
import { useGetSchema } from "@/composables/use-get-schema";

const t = useTranslations();

const collectionName = "viecpro_courts";

const queryBy = ["name", "main_owner.name", "kategorie"];

const koi = ["name", "main_owner.name", "start", "end", "kategorie"];
const tableCols = "grid-cols-[2fr_3fr_2fr_2fr_2fr]";

const { data, isFetching } = useGetSchema(
	computed(() => {
		return { collection: collectionName };
	}),
);

const facets = computed(() => {
	return data.value?.fields
		?.filter((field) => {
			return field.facet;
		})
		.map((field) => {
			return field.name;
		});
});

const sortable = computed(() => {
	return data.value?.fields
		?.filter((field) => {
			return field.sort;
		})
		.map((field) => {
			return field.name;
		});
});

usePageMetadata({
	title: `${t("pages.searchviews.courts.title")} ${t("pages.search.title")}`,
});
</script>

<template>
	<Centered v-if="isFetching">
		<Loader2 class="size-8 animate-spin" />
	</Centered>
	<SearchTable
		v-else
		:collection-name="collectionName"
		:cols="tableCols"
		:custom-cols="{
			'main_owner.name': 'main_owner',
			name: 'default',
		}"
		:default-sorting="data?.default_sorting_field"
		:facets="facets"
		:koi="koi"
		:query-by="queryBy"
		:sort="sortable"
	/>
</template>
