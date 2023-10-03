<script lang="ts" setup>
import SearchTable from "@/components/search-table.vue";
import { definePageMeta } from "#imports";

const collectionName = "viecpro_references";
const queryBy = "folio";
const koi = ["id", "folio", "shortTitle"];

definePageMeta({
	title: "pages.searchviews.courts.title",
});
</script>

<template>
	<SearchTable :collection-name="collectionName" :query-by="queryBy" :koi="koi">Events</SearchTable>
</template>
