<script lang="ts" setup>
import { useQuery } from "@tanstack/vue-query";
import { Loader2 } from "lucide-vue-next";

import SearchTable from "@/components/search-table.vue";
import { getSchema } from "@/composables/use-ts-data";
import { definePageMeta } from "#imports";

const t = useTranslations();

const collectionName = "viecpro_courts";

const queryBy = ["name", "main_owner.name", "kategorie"];

const koi = ["name", "main_owner.name", "start", "end", "kategorie"];
const tableCols = "grid-cols-[2fr_3fr_2fr_2fr_2fr]";

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

definePageMeta({
	title: "pages.searchviews.courts.title",
});

useHead({
	title: `${t("pages.searchviews.courts.title")} ${t("pages.search.title")}`,
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
			'main_owner.name': 'main_owner',
			name: 'default',
		}"
		:default-sorting="schema.data?.default_sorting_field"
		:facets="facets"
		:koi="koi"
		:query-by="queryBy"
		:sort="sortable"
	/>
</template>
