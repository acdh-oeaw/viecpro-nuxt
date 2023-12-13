<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { useRoute } from "vue-router";

import type { Person, PersonDetail } from "@/types/schema";
import { definePageMeta, getDetails, getDocument, ref } from "#imports";

const route = useRoute();
const id = String(route.params.id);

const data = ref({
	entity: useQuery({
		queryKey: ["viecpro_persons", id],
		queryFn: () => getDocument<Person>("viecpro_persons", `Person_${id}`),
	}),
	details: useQuery({
		queryKey: ["detail", "viecpro_persons", id],
		queryFn: () => getDetails<PersonDetail>("person", id),
	}),
});

const loading = {
	entity: computed(() => data.value.entity.isLoading),
	details: computed(() => data.value.details.isLoading),
};

definePageMeta({
	title: "pages.searchviews.institutions.title",
});
</script>

<template>
	<div class="mx-auto h-full w-full max-w-container">
		<div>
			{{ route.params.id }}
		</div>
		<div>
			{{ loading }}
		</div>
		<pre>
			{{ data }}
		</pre
		>
	</div>
</template>
