<script lang="ts" setup>
import SearchTable from "@/components/search-table.vue";

const collectionName = "viecpro_events";

const queryBy = "name";

const koi = ["object_id", "name", "kind", "start_date", "end_date"];
</script>

<template>
	<SearchTable :collection-name="collectionName" :query-by="queryBy" :koi="koi">Events</SearchTable>
</template>
