<script lang="ts" setup>
// If youre reading this its too late

import { useQueries } from "@tanstack/vue-query";
import { isEmpty } from "lodash-es";
import { Loader } from "lucide-vue-next";
import type { SearchParams, SearchResponse } from "typesense/lib/Typesense/Documents";

import type { AnyEntity } from "@/types/schema";

const props = defineProps<{
	collection:
		| "viecpro_courts"
		| "viecpro_events"
		| "viecpro_institutions"
		| "viecpro_persons"
		| "viecpro_places"
		| "viecpro_relations";
	query: SearchParams;
	all: number;
}>();

type QueryKey = [string, string, SearchParams];

const limit = 250;
const pages = Math.ceil(props.all / limit);

const queries: Array<{
	queryKey: QueryKey;
	queryFn: ({ queryKey }: { queryKey: QueryKey }) => Promise<SearchResponse<AnyEntity>>;
	enabled?: boolean;
}> = [];

for (let i = 1; i <= pages; i++) {
	queries.push({
		queryKey: [
			"search",
			props.collection,
			{
				...props.query,
				per_page: limit,
				page: i,
			},
		] as const,
		queryFn: async ({ queryKey }) => {
			const [, collection, q] = queryKey;
			return await getDocuments(q, collection);
		},
	});
}

const fetches = useQueries({
	queries,
	combine: (results) => {
		return {
			data: results
				.map((res) => res.data?.hits)
				.flat()
				.map((hit) => hit?.document)
				.filter((doc) => doc !== undefined) as Array<AnyEntity>,
			fetching: results.some((result) => result.isFetching),
		};
	},
});
</script>

<template>
	<div v-if="fetches.fetching" class="rounded border">
		<Loader class="w-full animate-spin" />
	</div>
	<template v-else-if="!isEmpty(fetches.data)">
		<XlsxButtonTable
			:data="fetches.data"
			:collection="collection"
			class="rounded border transition hover:bg-slate-200 active:bg-slate-300"
		/>
		<JsonDownloadButton
			class="rounded border transition hover:bg-slate-200 active:bg-slate-300"
			:data="fetches.data"
			:name="collection"
		/>
	</template>
</template>
