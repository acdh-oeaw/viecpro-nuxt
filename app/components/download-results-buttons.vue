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
		| "viecpro_references"
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
				.map((res) => {
					return res.data?.hits;
				})
				.flat()
				.map((hit) => {
					return hit?.document;
				})
				.filter((doc) => {
					return doc !== undefined;
				}) as Array<AnyEntity>,
			fetching: results.some((result) => {
				return result.isFetching;
			}),
			done: results.filter((result) => {
				return !result.isFetching;
			}).length,
		};
	},
});
</script>

<template>
	<div v-if="fetches.fetching" class="rounded border p-1">
		{{ Math.floor(100 * (fetches.done / pages)) }}%
		<Loader class="w-full animate-spin" />
	</div>
	<template v-else-if="!isEmpty(fetches.data)">
		<JsonDownloadButton
			class="rounded border p-2 pb-1 text-primary-600 shadow transition hover:bg-slate-200 active:bg-slate-300"
			:data="fetches.data"
			:name="collection"
		>
			<span class="text-xs font-semibold">.json</span>
		</JsonDownloadButton>
		<XlsxButtonTable
			class="rounded border p-2 pb-1 text-primary-600 shadow transition hover:bg-slate-200 active:bg-slate-300"
			:collection="collection"
			:data="fetches.data"
		>
			<span class="text-xs font-semibold">.xlsx</span>
		</XlsxButtonTable>
	</template>
</template>
