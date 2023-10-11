<script lang="ts" setup>
import SearchTable from "@/components/search-table.vue";
import { definePageMeta } from "#imports";

const collectionName = "viecpro_references";
const queryBy = "folio";
const koi = ["id", "folio", "shortTitle", "related_doc.name"];
const facets = ["shortTitle", "related_doc.name"];
const tableCols = "grid-cols-[2fr_3fr_3fr_3fr]";

definePageMeta({
	title: "pages.searchviews.courts.title",
});
</script>

<template>
	<SearchTable
		:collection-name="collectionName"
		:facets="facets"
		:query-by="queryBy"
		:cols="tableCols"
		:koi="koi"
	>
		Events
	</SearchTable>
</template>
