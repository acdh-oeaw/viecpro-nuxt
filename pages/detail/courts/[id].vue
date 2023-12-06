<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { useRoute } from "vue-router";

import Tooltip from "@/components/tooltip.vue";
import type { Court } from "@/types/schema";
import { definePageMeta, ref } from "#imports";

const route = useRoute();
const id = String(route.params.id);

const data = ref({
	entity: useQuery({
		queryKey: ["court", id],
		queryFn: () => getDocument<Court>("viecpro_courts", `Hofstaat_${id}`),
	}),
});

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
		<pre>
			{{ data }}
		</pre
		>
	</div>
</template>
