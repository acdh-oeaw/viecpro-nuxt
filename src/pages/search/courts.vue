<script lang="ts" setup>
import SearchTable from "@/components/search-table.vue";
import { definePageMeta } from "#imports";

const collectionName = "viecpro_courts";

const queryBy = "name";

const koi = ["id", "name", "kind", "start_date", "end_date", "main_owner.name"];
const facets = ["main_owner.name", "kind"];

definePageMeta({
	title: "pages.searchviews.courts.title",
});
</script>

<template>
	<SearchTable :collection-name="collectionName" :query-by="queryBy" :koi="koi" :facets="facets" />
</template>
