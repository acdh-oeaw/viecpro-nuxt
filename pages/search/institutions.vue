<script lang="ts" setup>
import SearchTable from "@/components/search-table.vue";
import { definePageMeta } from "#imports";

const collectionName = "viecpro_institutions";
const queryBy = "name";
const koi = ["name", "kind", "start", "end"];
const facets = ["kind"];
const tableCols = "grid-cols-[3fr_3fr_2fr_2fr]";

definePageMeta({
	title: "pages.searchviews.institutions.title",
});
</script>

<template>
	<SearchTable
		:collection-name="collectionName"
		:facets="facets"
		:cols="tableCols"
		:query-by="queryBy"
		:koi="koi"
	/>
</template>
