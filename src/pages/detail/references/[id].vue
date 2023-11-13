<script setup lang="ts">
import { useRoute } from "vue-router";

import DetailPage from "@/components/detail-page.vue";
import { getDocumentAndRelations } from "@/composables/use-ts-data";
import { definePageMeta, ref, useRuntimeConfig } from "#imports";

const env = useRuntimeConfig();
const route = useRoute();
const id = String(route.params.id);
const loading = ref(true);

const data = await getDocumentAndRelations(
	"Reference_",
	`${env.public.NUXT_PUBLIC_TYPESENSE_COLLECTION_PREFIX}references`,
	id,
);

loading.value = false;
console.log(data);

definePageMeta({
	title: "pages.searchviews.references.title",
});
</script>

<template>
	<div class="mx-auto h-full w-full max-w-container">
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
