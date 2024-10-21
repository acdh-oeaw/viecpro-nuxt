<script lang="ts" setup>
import { Loader2 } from "lucide-vue-next";

import SearchTable from "@/components/search-table.vue";
import { useGetSchema } from "@/composables/use-get-schema";

const t = useTranslations();

const collectionName = "viecpro_places";
const queryBy = ["name", "alternativenames"];
const koi = ["name", "kind", "ampel"];
const tableCols = "grid-cols-[3fr_2fr_2fr]";

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
	title: `${t("pages.searchviews.places.title")} ${t("pages.search.title")}`,
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
		:default-sorting="data?.default_sorting_field"
		:facets="facets"
		:koi="koi"
		:query-by="queryBy"
		:sort="sortable"
	/>
</template>
