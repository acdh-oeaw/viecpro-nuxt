<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { isEmpty } from "lodash";
import { useRoute } from "vue-router";

import Chip from "@/components/chip.vue";
import DetailDisclosure from "@/components/detail-disclosure.vue";
import type { Person, PersonDetail } from "@/types/schema";
import { definePageMeta, getDetails, getDocument, ref } from "#imports";

const route = useRoute();
const id = String(route.params.id);

const loading = ref(true);

const data = ref({
	entity: useQuery({
		queryKey: ["person", id],
		queryFn: () => getDocument<Person>("viecpro_persons", `Person_${id}`),
	}),
	details: useQuery({
		queryKey: ["detail", "person", id],
		queryFn: () => getDetails<PersonDetail>("person", id),
	}),
});

const labelCols = ["name", "start_date", "end_date"];
const relCols = ["relation_type", "target.name", "start_date", "end_date"];

loading.value = false;

definePageMeta({
	title: "pages.searchviews.people.title",
});
</script>

<template>
	<div
		v-if="
			!data.entity.isPending && !data.details.isPending && data.details.data && data.entity.data
		"
		class="mx-auto h-full w-full max-w-container px-2 py-4 xl:px-0"
	>
		<h2 class="text-lg text-gray-500 lg:text-2xl">Datenblatt - Person</h2>
		<h1 class="text-2xl font-bold text-primary-600 xl:my-2 xl:text-4xl">
			{{ data.entity.data?.fullname }}
		</h1>
		<Chip v-if="data.details.data" class="my-1 text-sm lg:text-base" square>
			<span>
				{{
					data.details.data.court_functions
						.map((func) => func.relation_type)
						.slice(0, 3)
						.join(" - ")
				}}
			</span>
			<span v-if="data.details.data.court_functions.length > 3">
				+
				{{ data.details.data.court_functions.length - 3 }}
			</span>
		</Chip>
		<div class="mt-4 grid gap-16 md:grid-cols-[2fr_3fr]">
			<div class="flex flex-col gap-8">
				<div>
					<h2 class="text-2xl text-gray-500">Stammdaten</h2>
					<div v-if="!loading" class="grid grid-cols-2">
						<div class="col-span-2 my-1 border-t"></div>
						<span>Vorname/n:</span>
						<span>{{ data.entity.data.first_name }}</span>
						<div class="col-span-2 my-1 border-t"></div>
						<template v-if="data.entity.data.name">
							<span v-if="data.entity.data.gender === 'male'">Name:</span>
							<span v-else>Geburtsname:</span>
							<span>{{ data.entity.data.name }}</span>
							<div class="col-span-2 my-1 border-t"></div>
						</template>
						<template v-if="data.details.data?.married_names?.length">
							<span>Ehename/n:</span>
							<div>
								<div v-for="name in data.details.data.married_names" :key="name.name">
									{{ name.name }}
								</div>
							</div>
							<div class="col-span-2 my-1 border-t"></div>
						</template>

						<span>Geboren:</span>
						<span>
							<span>
								{{ data.entity.data.start_date }}
							</span>
							<span v-if="!isEmpty(data.details.data?.place_of_birth)">
								in {{ data.details.data?.place_of_birth.name }}
							</span>
						</span>
						<div class="col-span-2 my-1 border-t"></div>

						<span>Gestorben:</span>
						<span>
							<span>
								{{ data.entity.data.end_date }}
							</span>
							<span v-if="!isEmpty(data.details.data?.place_of_death)">
								in {{ data.details.data?.place_of_death.name }}
							</span>
						</span>
						<div class="col-span-2 my-1 border-t"></div>
						<span>Geschlecht:</span>
						<span>{{ data.entity.data.gender }}</span>
					</div>
				</div>
				<div class="flex flex-col gap-3">
					<DetailDisclosure
						title="Potenizelle Dubletten"
						:rels="data.details.data?.duplicates || []"
						:headers="['name']"
						grid-class="grid-cols-1"
					/>
					<!-- dont judge me -->
					<DetailDisclosure
						title="Alternative Namenschreibweisen"
						:rels="[]"
						:custom-slot="
							!isEmpty([
								...data.details.data?.alternative_first_names,
								...data.details.data?.alternative_last_names,
								...data.details.data?.married_names,
							])
						"
						grid-class="grid-cols-3"
					>
						<div class="grid gap-2">
							<div v-if="!isEmpty(data.details.data.alternative_first_names)">
								<div class="font-semibold">alternative_first_names</div>
								<div
									v-for="name in data.details.data.alternative_first_names"
									:key="name"
									class="border-t"
								>
									{{ name }}
								</div>
							</div>
							<div v-if="!isEmpty(data.details.data.alternative_last_names)">
								<div class="font-semibold">alternative_last_names</div>
								<div
									v-for="name in data.details.data.alternative_last_names"
									:key="name"
									class="border-t"
								>
									{{ name }}
								</div>
							</div>
							<div v-if="!isEmpty(data.details.data.married_names)">
								<div class="font-semibold">married_names</div>
								<div
									v-for="name in data.details.data.married_names"
									:key="name.name"
									class="border-t"
								>
									{{ name.name }}
								</div>
							</div>
						</div>
					</DetailDisclosure>
					<DetailDisclosure
						title="Adelstand und Auszeichnungen"
						:rels="data.details.data.honorary_titles"
						:headers="labelCols"
						grid-class="grid-cols-3"
					/>
					<DetailDisclosure
						title="Akademische Titel"
						:rels="data.details.data.academic_titles"
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
					:rels="data.details.data.court_functions"
					grid-class="grid-cols-4"
				/>
				<DetailDisclosure
					title="Personenbeziehungen am Hof"
					:rels="data.details.data.person_relations_court"
					:headers="relCols"
					grid-class="grid-cols-4"
				/>
				<DetailDisclosure
					title="Sonstiger Bezug zum Hof"
					:rels="data.details.data.other_relations_court"
					:headers="labelCols"
					grid-class="grid-cols-3"
				/>
				<h2 class="text-2xl text-gray-500">Weitere Informationen</h2>
				<DetailDisclosure
					title="Ehe- und Verwandschaftsverhältnisse"
					:rels="data.details.data.marriages_and_family_relations"
					:headers="relCols"
					grid-class="grid-cols-4"
				/>
				<DetailDisclosure
					title="Bezug zu Kirche und Orden"
					:rels="data.details.data.relations_to_church_and_orders"
					:headers="relCols"
					grid-class="grid-cols-4"
				/>
				<DetailDisclosure
					title="Sonstige Tätigkeiten"
					:rels="data.details.data.non_court_functions"
					:headers="relCols"
					grid-class="grid-cols-4"
				/>
			</div>
		</div>
	</div>
</template>
