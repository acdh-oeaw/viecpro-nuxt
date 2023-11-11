<script lang="ts" setup>
import SearchTable from "@/components/search-table.vue";

definePageMeta({
	title: "SearchPlacesPage.meta.title",
});

const collectionName = "viecpro_places";
const queryBy = "name";
const koi = ["id", "name", "kind", "lat", "long", "start_date", "end_date"];
const facets = ["kind"];
const tableCols = "grid-cols-[2fr_3fr_2fr_2fr_2fr_2fr_2fr]";
</script>

<template>
	<SearchTable
		:collection-name="collectionName"
		:facets="facets"
		:query-by="queryBy"
		:cols="tableCols"
		:koi="koi"
	/>
</template>
