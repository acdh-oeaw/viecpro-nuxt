<script lang="ts" setup>
import SearchTable from "@/components/search-table.vue";
import { definePageMeta } from "#imports";

const collectionName = "viecpro_places";
const queryBy = "name";
const koi = ["object_id", "name", "kind", "lat", "long", "start_date", "end_date"];
const facets = ["kind"];

definePageMeta({
	title: "pages.searchviews.courts.title",
});
</script>

<template>
	<SearchTable :collection-name="collectionName" :facets="facets" :query-by="queryBy" :koi="koi">
		Events
	</SearchTable>
</template>
