<script setup lang="ts">
import { useRoute } from "vue-router";

import DetailPage from "@/components/detail-page.vue";
import { getDocument } from "@/composables/use-ts-data";
import { definePageMeta, ref } from "#imports";

const route = useRoute();
const id = String(route.params.id);

const loading = ref(true);

const data = await getDocument("viecpro_courts", "Hofstaat_" + String(id));

// No relations should exist
// const relationsSource = await getRelations(id, "source.object_id", "Hofstaat");
// const relationsTarget = await getRelations(id, "target.object_id", "Hofstaat");

loading.value = false;
console.log(data);

definePageMeta({
	title: "pages.searchviews.events.title",
});
</script>

<template>
	<div class="mx-auto h-full w-full max-w-container">
		<div>
			{{ route.params.id }}
		</div>
		<DetailPage :loading="loading" :data="data" />
	</div>
</template>
