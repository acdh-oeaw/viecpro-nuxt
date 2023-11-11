<script lang="ts" setup>
import SearchTable from "@/components/search-table.vue";

definePageMeta({
	title: "SearchCourtsPage.meta.title",
});

const collectionName = "viecpro_courts";
const queryBy = "name";
const koi = ["id", "name", "kind", "start_date", "end_date", "main_owner.name"];
const facets = ["main_owner.name", "kind"];
const tableCols = "grid-cols-[2fr_2fr_2fr_2fr_2fr_3fr]";
</script>

<template>
	<SearchTable
		:collection-name="collectionName"
		:query-by="queryBy"
		:koi="koi"
		:facets="facets"
		:cols="tableCols"
	/>
</template>
