<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { useRoute } from "vue-router";

import type { Reference } from "@/types/schema";

const route = useRoute();
const id = String(route.params.id);

const data = ref({
	entity: useQuery({
		queryKey: ["court", id],
		queryFn: () => {
			return getDocument<Reference>("viecpro_references", `Reference_${id}`);
		},
	}),
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
