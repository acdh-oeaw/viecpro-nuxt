<script setup lang="ts">
import { useRoute } from "vue-router";

import { getDocument } from "@/composables/use-ts-data";
import { definePageMeta } from "#imports";

const route = useRoute();
const id = String(route.params.id);

const data = await getDocument("viecpro_references", "Reference_" + String(id));

// No relations should exist
// const relationsSource = await getRelations(id, "source.object_id");
// const relationsTarget = await getRelations(id, "target.object_id");

console.log(data);

definePageMeta({
	title: "pages.searchviews.events.title",
});
</script>

<template>
	<div class="mx-auto w-full max-w-container">
		<div>
			{{ route.params.id }}
		</div>
		<div>
			<h1 class="text-2xl">Entity:</h1>
			<pre>{{ data }}</pre>
		</div>
	</div>
</template>
