<script lang="ts" setup>
import { useQuery } from "@tanstack/vue-query";
import { Loader2 } from "lucide-vue-next";

import SearchTable from "@/components/search-table.vue";
import { getSchema } from "@/composables/use-ts-data";
import { definePageMeta } from "#imports";

const collectionName = "viecpro_places";
const queryBy = "name";
const koi = ["name", "kind"];
const tableCols = "grid-cols-[3fr_2fr]";

const schema = ref(
	useQuery({
		queryKey: ["schema", collectionName] as const,
		queryFn: ({ queryKey }) => getSchema(queryKey[1]),
	}),
);

const facets = computed(
	() => schema.value.data?.fields?.filter((field) => field.facet).map((field) => field.name),
);
const sortable = computed(
	() => schema.value.data?.fields?.filter((field) => field.sort).map((field) => field.name),
);

definePageMeta({
	title: "pages.searchviews.places.title",
});
</script>

<template>
	<Centered v-if="schema.isFetching">
		<Loader2 class="h-8 w-8 animate-spin" />
	</Centered>
	<SearchTable
		v-else
		:collection-name="collectionName"
		:facets="facets"
		:query-by="queryBy"
		:sort="sortable"
		:cols="tableCols"
		:koi="koi"
	/>
</template>
