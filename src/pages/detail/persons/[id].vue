<script setup lang="ts">
import { type SearchResponse } from "typesense/lib/Typesense/Documents";
import { useRoute } from "vue-router";

import Chip from "@/components/chip.vue";
import DetailDisclosure from "@/components/detail-disclosure.vue";
import { getDocumentAndRelations } from "@/composables/use-ts-data";
import { type Person, type Relation } from "@/lib/schema.types";
import { definePageMeta, ref, useRuntimeConfig } from "#imports";

const env = useRuntimeConfig();

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
	<div class="mx-auto h-full w-full max-w-container py-4">
		<h2 class="text-2xl text-gray-500">Datenblatt - Person</h2>
		<h1 class="text-3xl font-bold text-primary-600">{{ data.entity.fullname }}</h1>
		<Chip
			v-if="data.source.hits?.some((hit) => hit.document.model === 'PersonInstitution')"
			class="my-1"
			square
		>
			{{
				data.source.hits
					.filter((hit) => hit.document.model === "PersonInstitution")
					.map((hit) => hit.document.relation_type)
					.join(", ")
			}}
		</Chip>
		<div class="mt-4 grid gap-16 md:grid-cols-[2fr_3fr]">
			<div>
				<h2 class="text-2xl text-gray-500">Stammdaten</h2>
				<div v-if="!loading" class="grid grid-cols-2">
					<div class="col-span-2 my-1 border-t"></div>
					<template v-if="data.entity.name">
						<span>Geburtsname:</span>
						<span>{{ data.entity.name }}</span>
						<div class="col-span-2 my-1 border-t"></div>
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
						<div class="col-span-2 my-1 border-t"></div>
					</template>
					<span>Vorname/n:</span>
					<span>{{ data.entity.first_name }}</span>
					<div class="col-span-2 my-1 border-t"></div>

					<span>Geboren:</span>
					<span>
						{{ data.entity.start }}
					</span>
					<div class="col-span-2 my-1 border-t"></div>

					<span>Gestorben:</span>
					<span>
						{{ data.entity.end }}
					</span>
					<div class="col-span-2 my-1 border-t"></div>
					<span>Geschlecht:</span>
					<span>{{ data.entity.gender }}</span>
				</div>
			</div>
			<div class="flex flex-col gap-3">
				<h2 class="text-2xl text-gray-500">Bezug zum Wiener Hof</h2>
				<DetailDisclosure
					default-open
					title="Funktionen am Hof"
					:rels="
						data.source.hits
							? data.source.hits?.filter((hit) => hit.document.model === 'PersonInstitution')
							: []
					"
				/>
				<DetailDisclosure title="Personenbeziehungen am Hof" :rels="[]" />
				<DetailDisclosure title="Sonsitger Bezug zum Hof" :rels="[]" />
			</div>
		</div>
	</div>
</template>
