<script setup lang="ts">
import { isEmpty } from "lodash";
import { useRoute } from "vue-router";

import Chip from "@/components/chip.vue";
import DetailDisclosure from "@/components/detail-disclosure.vue";
import { definePageMeta, getEntityAndDetails, ref } from "#imports";

const route = useRoute();
const id = String(route.params.id);

const loading = ref(true);

const data = await getEntityAndDetails(id, "Person_", "person");

const labelCols = ["name", "start_date", "end_date"];
const relCols = ["relation_type", "target.name", "start_date", "end_date"];

loading.value = false;

definePageMeta({
	title: "pages.searchviews.people.title",
});
</script>

<template>
	<div class="mx-auto h-full w-full max-w-container px-2 py-4 xl:px-0">
		<h2 class="text-2xl text-gray-500">Datenblatt - Person</h2>
		<h1 class="text-3xl font-bold text-primary-600">{{ data.entity.fullname }}</h1>
		<Chip v-if="data.details" class="my-1" square>
			<span>
				{{
					data.details.court_functions
						.map((func) => func.relation_type)
						.slice(0, 3)
						.join(", ")
				}}
			</span>
			<span v-if="data.details.court_functions.length > 3">
				+
				{{ data.details.court_functions.length - 3 }}
			</span>
		</Chip>
		<div class="mt-4 grid gap-16 md:grid-cols-[2fr_3fr]">
			<div class="flex flex-col gap-8">
				<div>
					<h2 class="text-2xl text-gray-500">Stammdaten</h2>
					<div v-if="!loading" class="grid grid-cols-2">
						<div class="col-span-2 my-1 border-t"></div>
						<span>Vorname/n:</span>
						<span>{{ data.entity.first_name }}</span>
						<div class="col-span-2 my-1 border-t"></div>
						<template v-if="data.entity.name">
							<span v-if="data.entity.gender === 'male'">Name:</span>
							<span v-else>Geburtsname:</span>
							<span>{{ data.entity.name }}</span>
							<div class="col-span-2 my-1 border-t"></div>
						</template>
						<template v-if="data.details?.married_names?.length">
							<span>Ehename/n:</span>
							<div>
								<div v-for="name in data.details.married_names" :key="name.name">
									{{ name.name }}
								</div>
							</div>
							<div class="col-span-2 my-1 border-t"></div>
						</template>

						<span>Geboren:</span>
						<span>
							<span>
								{{ data.entity.start_date }}
							</span>
							<span v-if="!isEmpty(data.details?.place_of_birth)">
								in {{ data.details?.place_of_birth.name }}
							</span>
						</span>
						<div class="col-span-2 my-1 border-t"></div>

						<span>Gestorben:</span>
						<span>
							<span>
								{{ data.entity.end_date }}
							</span>
							<span v-if="!isEmpty(data.details?.place_of_death)">
								in {{ data.details?.place_of_death.name }}
							</span>
						</span>
						<div class="col-span-2 my-1 border-t"></div>
						<span>Geschlecht:</span>
						<span>{{ data.entity.gender }}</span>
					</div>
				</div>
				<div class="flex flex-col gap-3">
					<DetailDisclosure
						title="Potenizelle Dubletten"
						:rels="data.details?.duplicates || []"
						:headers="['name']"
						grid-class="grid-cols-1"
					/>
					<!-- TODO: create sections -->
					<DetailDisclosure
						title="Alternative Namenschreibweisen"
						:rels="[
							...data.details.alternative_first_names.map((name) => ({
								alternative_first_name: name,
							})),
							...data.details.alternative_last_names.map((name) => ({
								alternative_last_name: name,
							})),
							...data.details.married_names.map((name) => ({
								married_name: name,
							})),
						]"
						:headers="['alternative_first_name', 'alternative_last_name', 'married_names']"
						grid-class="grid-cols-3"
					/>
					<DetailDisclosure
						title="Adelstand und Auszeichnungen"
						:rels="data.details.honorary_titles"
						:headers="labelCols"
						grid-class="grid-cols-3"
					/>
					<DetailDisclosure
						title="Akademische Titel"
						:rels="data.details.academic_titles"
						:headers="labelCols"
						grid-class="grid-cols-3"
					/>
					<DetailDisclosure title="Download und Zitierweise" :rels="[]" :headers="[]" />
				</div>
			</div>
			<div class="flex flex-col gap-3">
				<h2 class="text-2xl text-gray-500">Bezug zum Wiener Hof</h2>
				<DetailDisclosure
					default-open
					title="Funktionen am Hof"
					:headers="relCols"
					:rels="data.details.court_functions"
					grid-class="grid-cols-4"
				/>
				<DetailDisclosure
					title="Personenbeziehungen am Hof"
					:rels="data.details.person_relations_court"
					:headers="relCols"
					grid-class="grid-cols-4"
				/>
				<DetailDisclosure
					title="Sonstiger Bezug zum Hof"
					:rels="data.details.other_relations_court"
					:headers="labelCols"
					grid-class="grid-cols-3"
				/>
				<h2 class="text-2xl text-gray-500">Weitere Informationen</h2>
				<DetailDisclosure
					title="Ehe- und Verwandschaftsverhältnisse"
					:rels="data.details.marriages_and_family_relations"
					:headers="relCols"
					grid-class="grid-cols-4"
				/>
				<DetailDisclosure
					title="Bezug zu Kirche und Orden"
					:rels="data.details.relations_to_church_and_orders"
					:headers="relCols"
					grid-class="grid-cols-4"
				/>
				<DetailDisclosure
					title="Sonstige Tätigkeiten"
					:rels="data.details.non_court_functions"
					:headers="relCols"
					grid-class="grid-cols-4"
				/>
			</div>
		</div>
	</div>
</template>
