<script lang="ts" setup>
import SearchTable from "@/components/search-table.vue";
import { definePageMeta } from "#imports";

const collectionName = "viecpro_events";

const queryBy = "name";

const koi = ["id", "name", "kind", "start_date", "end_date"];
const facets = ["kind"];
const tableCols = "grid-cols-[2fr_4fr_2fr_2fr_2fr]";

definePageMeta({
	title: "pages.searchviews.events.title",
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
