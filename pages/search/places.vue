<script lang="ts" setup>
import SearchTable from "@/components/search-table.vue";
import { definePageMeta } from "#imports";

const collectionName = "viecpro_places";
const queryBy = "name";
const koi = ["name", "kind"];
const facets = ["kind"];
const tableCols = "grid-cols-[3fr_2fr]";

definePageMeta({
	title: "pages.searchviews.places.title",
});
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
