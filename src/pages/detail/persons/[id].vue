<script setup lang="ts">
import { type SearchResponse } from "typesense/lib/Typesense/Documents";
import { useRoute } from "vue-router";

import { getDocumentAndRelations } from "@/composables/use-ts-data";
import { type Person, type Relation } from "@/lib/schema.types";
import { definePageMeta, ref, useRuntimeConfig } from "#imports";

const env = useRuntimeConfig();
console.log(`${env.public.NUXT_PUBLIC_TYPESENSE_COLLECTION_PREFIX}persons`);

const route = useRoute();
const id = String(route.params.id);

const loading = ref(true);

const data = (await getDocumentAndRelations(
	"Person_",
	`${env.public.NUXT_PUBLIC_TYPESENSE_COLLECTION_PREFIX}persons`,
	id,
	"Person",
)) as {
	entity: Person;
	source: SearchResponse<Relation>;
	target: SearchResponse<Relation>;
};

loading.value = false;
console.log(data);

definePageMeta({
	title: "pages.searchviews.people.title",
});
</script>

<template>
	<div class="mx-auto h-full w-full max-w-container">
		<h1>Stammdaten</h1>
		<div v-if="!loading" class="grid grid-cols-2 divide-y">
			<template v-if="data.entity.name">
				<span>Geburtsname:</span>
				<span>{{ data.entity.name }}</span>
			</template>
			<template
				v-if="
					data.entity.labels &&
					data.entity.labels.some(
						(label) => label.label_type && label.label_type.includes('verheiratet'),
					)
				"
			>
				<span>Ehename/n:</span>
				<div>
					<div
						v-for="label in data.entity.labels.filter(
							(x) => x.label_type && x.label_type.includes('verheiratet'),
						)"
						:key="label.object_id"
					>
						{{ label.name }}
					</div>
				</div>
			</template>
			<span>Vorname/n:</span>
			<span>{{ data.entity.first_name }}</span>
			<span>Geboren:</span>
			<span>
				{{ data.entity.start }}
			</span>
			<span>Gestorben:</span>
			<span>
				{{ data.entity.end }}
			</span>
			<span>Geschlecht:</span>
			<span>{{ data.entity.gender }}</span>
		</div>
		<pre>
			{{ data }}
		</pre
		>
	</div>
</template>
