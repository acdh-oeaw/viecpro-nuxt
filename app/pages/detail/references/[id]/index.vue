<script setup lang="ts">
import { useRoute } from "vue-router";

import { useGetDocument } from "@/composables/use-get-document";

const t = useTranslations();

const route = useRoute();
const id = String(route.params.id);

const entity = useGetDocument(
	computed(() => {
		return { collection: "viecpro_references", id: `Reference_${id}` };
	}),
);

const data = computed(() => {
	return { entity };
});

usePageMetadata({
	title: t("pages.searchviews.references.title"),
});
</script>

<template>
	<div class="mx-auto size-full max-w-container">
		<div>
			{{ route.params.id }}
		</div>
		<pre>
			{{ data }}
		</pre
		>
		<p>You should not be able to see this page, it is but a remnant of a long forgotten time.</p>
	</div>
</template>
