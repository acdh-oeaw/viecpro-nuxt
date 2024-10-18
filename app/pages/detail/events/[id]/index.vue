<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { useRoute } from "vue-router";

import type { Event } from "@/types/schema";

const t = useTranslations();

const route = useRoute();
const id = String(route.params.id);

const data = ref({
	entity: useQuery({
		queryKey: ["event", id],
		queryFn: () => {
			return getDocument<Event>("viecpro_events", `Event_${id}`);
		},
	}),
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
