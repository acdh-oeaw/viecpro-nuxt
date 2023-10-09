<script lang="ts" setup>
import SearchTable from "@/components/search-table.vue";
import { definePageMeta } from "#imports";

const collectionName = "viecpro_events";

const queryBy = "name";

const koi = ["object_id", "name", "kind", "start_date", "end_date"];
const facets = ["kind"];

definePageMeta({
	title: "pages.searchviews.events.title",
});
</script>

<template>
	<SearchTable :collection-name="collectionName" :facets="facets" :query-by="queryBy" :koi="koi">
		Events
	</SearchTable>
</template>
