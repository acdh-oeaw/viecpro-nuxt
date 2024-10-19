<script setup lang="ts">
import { useRoute } from "vue-router";

import { useGetDocument } from "@/composables/use-get-document";

const t = useTranslations();

const route = useRoute();
const id = String(route.params.id);

const data = ref({
	entity: useGetDocument(
		computed(() => {
			return { collection: "viecpro_events", id: `Event_${id}` };
		}),
	),
});

const title = computed(() => {
	if (data.value.entity.data?.name) {
		return `${data.value.entity.data.name} - ${t("pages.searchviews.events.sing")}`;
	}

	return t("pages.searchviews.events.sing");
});

usePageMetadata({
	title,
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
	</div>
</template>
