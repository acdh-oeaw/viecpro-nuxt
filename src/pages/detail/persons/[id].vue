<script setup lang="ts">
import { useRoute } from "vue-router";

import Chip from "@/components/chip.vue";
import DetailDisclosure from "@/components/detail-disclosure.vue";
import { getPersonDetails } from "@/composables/detail-pages/person";
import { definePageMeta, ref } from "#imports";

const route = useRoute();
const id = String(route.params.id);

const loading = ref(true);

const data = await getPersonDetails(id);

console.log("new Data", data);

loading.value = false;

definePageMeta({
	title: "pages.searchviews.people.title",
});
</script>

<template>
	<div class="mx-auto h-full w-full max-w-container py-4">
		<h2 class="text-2xl text-gray-500">Datenblatt - Person</h2>
		<h1 class="text-3xl font-bold text-primary-600">{{ data.fullname }}</h1>
		<Chip v-if="data.functions.data.length != 0" class="my-1" square>
			{{ data.functions.data.map((func) => func.name).join(", ") }}
		</Chip>
		<div class="mt-4 grid gap-16 md:grid-cols-[2fr_3fr]">
			<div class="flex flex-col gap-8">
				<div>
					<h2 class="text-2xl text-gray-500">Stammdaten</h2>
					<div v-if="!loading" class="grid grid-cols-2">
						<div class="col-span-2 my-1 border-t"></div>
						<template v-if="data.name">
							<span>Geburtsname:</span>
							<span>{{ data.name }}</span>
							<div class="col-span-2 my-1 border-t"></div>
						</template>
						<template v-if="data.married_name.data.length">
							<span>Ehename/n:</span>
							<div>
								<div v-for="name in data.married_name.data" :key="name.name">
									{{ name.name }}
								</div>
							</div>
							<div class="col-span-2 my-1 border-t"></div>
						</template>
						<span>Vorname/n:</span>
						<span>{{ data.first_name }}</span>
						<div class="col-span-2 my-1 border-t"></div>

						<span>Geboren:</span>
						<span>
							{{ data.start_date }}
						</span>
						<div class="col-span-2 my-1 border-t"></div>

						<span>Gestorben:</span>
						<span>
							{{ data.end_date }}
						</span>
						<div class="col-span-2 my-1 border-t"></div>
						<span>Geschlecht:</span>
						<span>{{ data.gender }}</span>
					</div>
				</div>
				<div class="flex flex-col gap-3">
					<DetailDisclosure
						title="Potenizelle Dubletten"
						:rels="data.duplicates.data"
						:headers="data.duplicates.headers"
						:grid-class="data.duplicates.cols"
					/>
					<DetailDisclosure
						title="Alternative Namenschreibweisen"
						:rels="data.alt_names.data"
						:headers="data.alt_names.headers"
						:grid-class="data.alt_names.cols"
					/>
					<DetailDisclosure
						title="Adelstand und Auszeichnungen"
						:rels="data.nobility.data"
						:headers="data.nobility.headers"
						:grid-class="data.nobility.cols"
					/>
					<DetailDisclosure
						title="Akademische Titel"
						:rels="data.titles.data"
						:headers="data.titles.headers"
						:grid-class="data.titles.cols"
					/>
					<DetailDisclosure
						title="Download und Zitierweise"
						:rels="data.download.data"
						:headers="data.download.headers"
						:grid-class="data.download.cols"
					/>
				</div>
			</div>
			<div class="flex flex-col gap-3">
				<h2 class="text-2xl text-gray-500">Bezug zum Wiener Hof</h2>
				<DetailDisclosure
					default-open
					title="Funktionen am Hof"
					:headers="['Bezeichnung', 'Institution', 'Von', 'Bis']"
					:rels="data.functions.data"
					grid-class="grid-cols-4"
				/>
				<DetailDisclosure title="Personenbeziehungen am Hof" :rels="[]" />
				<DetailDisclosure
					title="Sonsitger Bezug zum Hof"
					:rels="data.court_other.data"
					:headers="data.court_other.headers"
					:grid-class="data.court_other.cols"
				/>
				<h2 class="text-2xl text-gray-500">Weitere Informationen</h2>
				<DetailDisclosure
					title="Ehe- und Verwandschaftsverhältnisse"
					:rels="data.family.data"
					:headers="data.family.headers"
					:grid-class="data.family.cols"
				/>
				<DetailDisclosure
					title="Bezug zu Kirche und Orden"
					:rels="data.churches.data"
					:headers="data.churches.headers"
					:grid-class="data.churches.cols"
				/>
				<DetailDisclosure
					title="Sonstige Tätigkeiten"
					:rels="data.other_jobs.data"
					:headers="data.other_jobs.headers"
					:grid-class="data.other_jobs.cols"
				/>
			</div>
		</div>
	</div>
</template>
