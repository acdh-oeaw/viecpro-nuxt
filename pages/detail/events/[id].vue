<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { useRoute } from "vue-router";

import type { Event } from "@/types/schema";
import { definePageMeta, ref } from "#imports";

const t = useTranslations();

const route = useRoute();
const id = String(route.params.id);

const data = ref({
	entity: useQuery({
		queryKey: ["event", id],
		queryFn: () => getDocument<Event>("viecpro_events", `Event_${id}`),
	}),
});

definePageMeta({
	title: "pages.searchviews.events.title",
});

const title = computed(() => {
	if (data.value.entity.data.value?.name)
		return `${data.value.entity.data.value.name} - ${t("pages.searchviews.events.sing")}`;
	return t("pages.searchviews.events.sing");
});

useHead({
	title: title.value,
});
</script>

<template>
	<div class="mx-auto h-full w-full max-w-container">
		<div>
			{{ route.params.id }}
		</div>
		<pre>
			{{ data }}
		</pre
		>
	</div>
</template>
