<script lang="ts" setup>
import { useRoute } from "vue-router";

import DetailPage from "@/components/detail-page.vue";
import { getDocumentAndRelations } from "@/composables/use-ts-data";
import { definePageMeta, ref } from "#imports";

const route = useRoute();
const id = String(route.params.id);

const loading = ref(true);
const data = await getDocumentAndRelations("Hofstaat_", "viecpro_courts", id);

loading.value = false;
console.log(data);

definePageMeta({
	title: "pages.searchviews.courts.title",
});
</script>

<template>
	<div class="max-w-container mx-auto h-full w-full">
		<div>
			<Tooltip content="test">
				{{ route.params.id }}
			</Tooltip>
		</div>
		<DetailPage
			:loading="loading"
			:data="data.entity"
			:target="data.target"
			:source="data.source"
		/>
	</div>
</template>
