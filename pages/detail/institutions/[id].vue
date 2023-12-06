<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { useRoute } from "vue-router";

import type { Institution } from "@/types/schema";
import { definePageMeta, ref } from "#imports";

const route = useRoute();
const id = String(route.params.id);

const data = ref({
	entity: useQuery({
		queryKey: ["institution", id],
		queryFn: () => getDocument<Institution>("viecpro_institutions", `Institution_${id}`),
	}),
});

console.log(data);

definePageMeta({
	title: "pages.searchviews.institutions.title",
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
