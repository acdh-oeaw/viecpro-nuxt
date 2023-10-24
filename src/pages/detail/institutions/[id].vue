<script setup lang="ts">
import { useRoute } from "vue-router";

import DetailPage from "@/components/detail-page.vue";
import { getDocument, getRelations } from "@/composables/use-ts-data";
import { definePageMeta, ref } from "#imports";

const route = useRoute();
const id = String(route.params.id);

const loading = ref(true);

const data = await getDocument("viecpro_institutions", "Institution_" + String(id));
const relationsSource = await getRelations(id, "source.object_id", "Institution");
const relationsTarget = await getRelations(id, "target.object_id", "Institution");

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
		<DetailPage
			:data="data"
			:source="relationsSource"
			:target="relationsTarget"
			:loading="loading"
		/>
	</div>
</template>
