<script lang="ts" setup>
import { useQuery } from "@tanstack/vue-query";
import { Loader2 } from "lucide-vue-next";

import SearchTable from "@/components/search-table.vue";
import { getSchema } from "@/composables/use-ts-data";
import { definePageMeta } from "#imports";

const t = useTranslations();

const collectionName = "viecpro_institutions";
const queryBy = ["name", "alternativenames"];
const koi = ["name", "start", "end", "label:Auflösung", "label:Kategorie", "ampel"];
const tableCols = "grid-cols-[3fr_2fr_2fr_3fr_2fr_1fr]";

const schema = ref(
	useQuery({
		queryKey: ["schema", collectionName] as const,
		queryFn: ({ queryKey }) => getSchema(queryKey[1]),
	}),
);

const facets = computed(() =>
	schema.value.data?.fields?.filter((field) => field.facet).map((field) => field.name),
);
const sortable = computed(() =>
	schema.value.data?.fields?.filter((field) => field.sort).map((field) => field.name),
);

definePageMeta({
	title: "pages.searchviews.institutions.title",
});

useHead({
	title: `${t("pages.searchviews.institutions.title")} ${t("pages.search.title")}`,
});

useHead({
	title: `${t("pages.searchviews.institutions.title")} ${t("pages.search.title")}`,
});
</script>

<template>
	<Centered v-if="schema.isFetching">
		<Loader2 class="size-8 animate-spin" />
	</Centered>
	<SearchTable
		v-else
		:collection-name="collectionName"
		:facets="facets"
		:sort="sortable"
		:cols="tableCols"
		:query-by="queryBy"
		:koi="koi"
		:default-sorting="schema.data?.default_sorting_field"
	/>
</template>
