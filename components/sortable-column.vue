<script lang="ts" setup>
import { ChevronsUpDown, ChevronUp } from "lucide-vue-next";
import type { LocationQuery } from "vue-router";

const t = useTranslations();

const props = defineProps<{
	col: string;
	query: LocationQuery;
}>();

const getSortString = () => {
	switch (props.query.sort) {
		case `${props.col}:asc`:
			return `${props.col}:desc`;
		case `${props.col}:desc`:
			return "";
		default:
			return `${props.col}:asc`;
	}
};
</script>

<template>
	<NuxtLink
		class="-m-1 flex items-center gap-2 rounded p-1 transition hover:bg-slate-200 active:bg-slate-300"
		:to="{
			query: {
				...query,
				page: 1,
				sort: getSortString(),
			},
		}"
	>
		{{ t(`collection-keys["${col}"]`) }}
		<ChevronUp
			v-if="query.sort && query.sort.includes(col)"
			:class="{
				'rotate-180': !query.sort?.includes('desc'),
			}"
			class="h-4 w-4"
		/>
		<ChevronsUpDown v-else class="h-5 w-5 opacity-50" />
		<span class="sr-only">{{ t("ui.sort-by") }}</span>
	</NuxtLink>
</template>
