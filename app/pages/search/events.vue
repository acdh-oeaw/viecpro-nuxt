<script lang="ts" setup>
import { useQuery } from "@tanstack/vue-query";
import { Loader2 } from "lucide-vue-next";

import SearchTable from "@/components/search-table.vue";
import { getSchema } from "@/composables/use-ts-data";

const t = useTranslations();

const collectionName = "viecpro_events";

const queryBy = ["name", "alternativenames"];

const koi = ["name", "start", "end", "kind", "label:Auflösung", "label:Kategorie", "ampel"];
const tableCols = "grid-cols-[4fr_2fr_2fr_2fr_2fr_2fr_1fr]";

const schema = ref(
	useQuery({
		queryKey: ["schema", collectionName] as const,
		queryFn: ({ queryKey }) => {
			return getSchema(queryKey[1]);
		},
	}),
);

const facets = computed(() => {
	return schema.value.data?.fields
		?.filter((field) => {
			return field.facet;
		})
		.map((field) => {
			return field.name;
		});
});
const sortable = computed(() => {
	return schema.value.data?.fields
		?.filter((field) => {
			return field.sort;
		})
		.map((field) => {
			return field.name;
		});
});

usePageMetadata({
	title: `${t("pages.searchviews.events.title")} ${t("pages.search.title")}`,
});
</script>

<template>
	<Centered v-if="schema.isFetching">
		<Loader2 class="size-8 animate-spin" />
	</Centered>
	<SearchTable
		v-else
		:collection-name="collectionName"
		:cols="tableCols"
		:custom-cols="{
			context: 'this is a workaround, dont tell anybody 🤫',
		}"
		:default-sorting="schema.data?.default_sorting_field"
		:facets="facets"
		:koi="koi"
		:query-by="queryBy"
		:sort="sortable"
	/>
</template>
