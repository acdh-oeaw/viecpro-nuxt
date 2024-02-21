<script lang="ts" setup>
import { useQuery } from "@tanstack/vue-query";
import { Loader2 } from "lucide-vue-next";

import SearchTable from "@/components/search-table.vue";
import { getSchema } from "@/composables/use-ts-data";
import { definePageMeta } from "#imports";

const collectionName = "viecpro_relations";
const queryBy = ["target.name", "source.name", "relation_type"];
const koi = ["source_kind", "source.name", "relation_type", "target.name", "target_kind"];
const tableCols = "grid-cols-[2fr_3fr_3fr_2fr_3fr]";

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
	title: "pages.searchviews.relations.title",
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
		:custom-cols="{
			'source.name': 'source',
			'target.name': 'target',
		}"
	/>
</template>
