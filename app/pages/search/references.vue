<script lang="ts" setup>
import { Loader2 } from "lucide-vue-next";

import SearchTable from "@/components/search-table.vue";
import { useGetSchema } from "@/composables/use-get-schema";

const t = useTranslations();

const collectionName = "viecpro_references";
const queryBy = "folio";
const koi = ["id", "folio", "shortTitle", "related_doc.name"];
const tableCols = "grid-cols-[2fr_3fr_3fr_3fr]";

const { data, isFetching } = useGetSchema(
	computed(() => {
		return { collection: collectionName };
	}),
);

const facets = computed(() => {
	return data.value?.fields
		?.filter((field) => {
			return field.facet;
		})
		.map((field) => {
			return field.name;
		});
});
const sortable = computed(() => {
	return data.value?.fields
		?.filter((field) => {
			return field.sort;
		})
		.map((field) => {
			return field.name;
		});
});

usePageMetadata({
	title: `${t("pages.searchviews.references.title")} ${t("pages.search.title")}`,
});
</script>

<template>
	<Centered v-if="isFetching">
		<Loader2 class="size-8 animate-spin" />
	</Centered>
	<SearchTable
		v-else
		:collection-name="collectionName"
		:cols="tableCols"
		:facets="facets"
		:koi="koi"
		:query-by="queryBy"
		:sort="sortable"
	/>
</template>
