<script lang="ts" setup>
import { useRoute } from "vue-router";

import DetailPage from "@/components/detail-page.vue";
import { getDocumentAndRelations } from "@/composables/use-ts-data";
import { definePageMeta, ref } from "#imports";

const route = useRoute();
const id = String(route.params.id);
const loading = ref(true);

const data = await getDocumentAndRelations("Reference_", "viecpro_references", id);

loading.value = false;
console.log(data);

definePageMeta({
	title: "pages.searchviews.references.title",
});
</script>

<template>
	<div class="max-w-container mx-auto h-full w-full">
		<div>
			{{ route.params.id }}
		</div>
		<DetailPage
			:loading="loading"
			:data="data.entity"
			:source="data.source"
			:target="data.target"
		/>
	</div>
</template>
