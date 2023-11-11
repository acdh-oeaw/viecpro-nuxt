<script lang="ts" setup>
import SearchTable from "@/components/search-table.vue";

definePageMeta({
	title: "SearchReferencesPage.meta.title",
});

const collectionName = "viecpro_references";
const queryBy = "folio";
const koi = ["id", "folio", "shortTitle", "related_doc.name"];
const facets = ["shortTitle", "related_doc.name"];
const tableCols = "grid-cols-[2fr_3fr_3fr_3fr]";
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
