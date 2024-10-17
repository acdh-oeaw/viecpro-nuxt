<script lang="ts" setup>
import { ArrowRight, Download } from "lucide-vue-next";
import type { SearchParams } from "typesense/lib/Typesense/Documents";

import DownloadResultsButtons from "@/components/download-results-buttons.vue";

const enabled = ref(false);

defineProps<{
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
</script>

<template>
	<div class="flex size-fit gap-2">
		<button
			class="rounded border transition hover:bg-slate-200 active:bg-slate-300"
			@click="enabled = !enabled"
		>
			<ArrowRight v-if="enabled" class="relative m-2 size-6" />
			<Download v-else class="relative m-2 size-6" />
		</button>
		<DownloadResultsButtons v-if="enabled" :all="all" :collection="collection" :query="query" />
	</div>
</template>
