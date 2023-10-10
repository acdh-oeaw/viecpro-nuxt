<script setup lang="ts">
import { useRoute } from "vue-router";

import { getDocument } from "@/composables/use-ts-data";
import { definePageMeta } from "#imports";

const route = useRoute();
const id = route.params.id;

const data = await getDocument("viecpro_persons", "Person_" + String(id));

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
			<pre>{{ data }}</pre>
		</div>
	</div>
</template>
