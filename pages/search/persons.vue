<script lang="ts" setup>
import SearchTable from "@/components/search-table.vue";
import { definePageMeta } from "#imports";

const collectionName = "viecpro_persons";
const queryBy = ["first_name", "name"];
const koi = ["first_name", "name", "start", "end", "gender"];
const facets = ["name", "gender"];
const sortable = ["first_name", "fullname"];
const tableCols = "grid-cols-[3fr_3fr_2fr_2fr_2fr]";

definePageMeta({
	title: "pages.searchviews.people.title",
});
</script>

<template>
	<SearchTable
		:collection-name="collectionName"
		:facets="facets"
		:query-by="queryBy"
		:cols="tableCols"
		:sort="sortable"
		:koi="koi"
	/>
</template>
