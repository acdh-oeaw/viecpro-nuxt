<script lang="ts" setup>
import SearchTable from "@/components/search-table.vue";

const collectionName = "viecpro_persons";
const queryBy = "name";
const koi = ["object_id", "fullname", "gender", "start_date", "end_date"];
</script>

<template>
	<SearchTable :collection-name="collectionName" :query-by="queryBy" :koi="koi">People</SearchTable>
</template>
