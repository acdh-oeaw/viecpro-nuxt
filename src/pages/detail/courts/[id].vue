<script setup lang="ts">
import { useRoute } from "vue-router";

import DetailPage from "@/components/detail-page.vue";
import Tooltip from "@/components/tooltip.vue";
import { getDocument, getRelations } from "@/composables/use-ts-data";
import { definePageMeta, ref } from "#imports";

const route = useRoute();
const id = String(route.params.id);

const loading = ref(true);
const data = await getDocument("viecpro_courts", "Hofstaat_" + String(id));

// No relations should exist
const relationsSource = await getRelations(id, "source.object_id");
const relationsTarget = await getRelations(id, "target.object_id");

loading.value = false;
console.log(data);

definePageMeta({
	title: "pages.searchviews.courts.title",
});
</script>

<template>
	<div class="mx-auto h-full w-full max-w-container">
		<div>
			<Tooltip content="test">
				{{ route.params.id }}
			</Tooltip>
		</div>
		<DetailPage
			:loading="loading"
			:data="data"
			:target="relationsTarget"
			:source="relationsSource"
		/>
	</div>
</template>
