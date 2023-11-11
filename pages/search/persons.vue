<script lang="ts" setup>
import SearchTable from "@/components/search-table.vue";

definePageMeta({
	title: "SearchPersonsPage.meta.title",
});

const collectionName = "viecpro_persons";
const queryBy = "fullname";
const koi = ["id", "fullname", "gender", "start_date", "end_date"];
const facets = ["name", "gender"];
const tableCols = "grid-cols-[2fr_3fr_2fr_2fr_2fr]";
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
