<script lang="ts" setup>
import SearchTable from "@/components/search-table.vue";
import { definePageMeta } from "#imports";

const collectionName = "viecpro_courts";

const queryBy = ["name", "main_owner.name"];

const koi = ["name", "main_owner.name", "start", "end"];
const facets = ["main_owner.name", "kind"];
const sortable = ["name", "main_owner.object_id"];
const tableCols = "grid-cols-[2fr_3fr_2fr_2fr]";

definePageMeta({
	title: "pages.searchviews.courts.title",
});
</script>

<template>
	<SearchTable
		:collection-name="collectionName"
		:query-by="queryBy"
		:koi="koi"
		:facets="facets"
		:cols="tableCols"
		:sort="sortable"
	/>
</template>
