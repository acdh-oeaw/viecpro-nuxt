<script lang="ts" setup>
import { ChevronUp } from "lucide-vue-next";
import { type SearchResponse } from "typesense/lib/Typesense/Documents";
import { type Ref, ref } from "vue";

import { getDocuments } from "@/composables/use-ts-data";

const props = defineProps<{
	queryBy: string;
	collectionName: string;
	koi: Array<string>;
}>();

const input: Ref<string> = ref("");

const docs: Ref<SearchResponse<Record<string, Document>>> = ref(
	await getDocuments(
		{
			q: "",
			query_by: props.queryBy,
		},
		props.collectionName,
	),
);

const search = async () => {
	docs.value = await getDocuments(
		{
			q: input.value,
			query_by: props.queryBy,
		},
		props.collectionName,
	);
};
</script>

<template>
	<div class="flex flex-col">
		<div>
			<label for="searchinput" class="sr-only">Search</label>
			<input
				id="searchinput"
				v-model="input"
				type="text"
				class="my-2 h-12 w-full rounded p-2 shadow"
				placeholder="Search..."
				@input="search"
			/>
		</div>
		<slot />
		<div class="grid" :style="`grid-template-columns: repeat(${koi.length}, minmax(0, 1fr))`">
			<div v-for="key in koi" :key="key" class="m-2">
				{{ key }}
			</div>
			<template v-for="hit in docs.hits">
				<div v-for="key in koi" :key="key + hit.document.id" class="m-2">
					{{ hit.document[key] }}
				</div>
			</template>
		</div>
		<div class="flex items-center justify-between">
			<div
				class="cursor-pointer rounded border p-2 transition hover:bg-slate-200 active:bg-slate-300"
			>
				<ChevronUp class="h-5 w-5 -rotate-90" />
			</div>
			<div>
				showing {{ (docs.page - 1) * (docs.request_params.per_page || 10) + 1 }} -
				{{ Math.min(docs.page * (docs.request_params.per_page || 10), docs.found) }} out of
				{{ docs.found }}
			</div>
			<div
				class="cursor-pointer rounded border p-2 transition hover:bg-slate-200 active:bg-slate-300"
			>
				<ChevronUp class="h-5 w-5 rotate-90" />
			</div>
		</div>
	</div>
</template>
