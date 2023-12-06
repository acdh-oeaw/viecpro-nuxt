<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { useRoute } from "vue-router";

import type { Reference } from "@/types/schema";
import { definePageMeta, ref } from "#imports";

const route = useRoute();
const id = String(route.params.id);

const data = ref({
	entity: useQuery({
		queryKey: ["court", id],
		queryFn: () => getDocument<Reference>("viecpro_references", `Reference_${id}`),
	}),
});

definePageMeta({
	title: "pages.searchviews.references.title",
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
