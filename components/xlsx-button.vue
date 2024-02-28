<script lang="ts" setup>
import type { UseQueryReturnType } from "@tanstack/vue-query";
import dXlsx from "json-as-xlsx";
import { FileSpreadsheet } from "lucide-vue-next";

import type { AnyDetail, AnyEntity } from "@/types/schema";

const props = defineProps<{
	data: {
		entity: UseQueryReturnType<AnyEntity, Error>;
		details: UseQueryReturnType<AnyDetail, Error>;
	};
	collection: "viecpro_courts" | "viecpro_institutions" | "viecpro_persons" | "viecpro_places";
}>();

const standardRelation = [
	{ label: "Relation Type", value: "relation_type" },
	{ label: "Name", value: "target.name" },
	{ label: "ID", value: "target.object_id" },
	{ label: "Start", value: "start_date" },
	{ label: "End", value: "end_date" },
];
let xlsxData;

switch (props.collection) {
	case "viecpro_courts":
		xlsxData = {
			sheets: [
				{
					sheet: "Base",
					columns: [
						{ label: "ID", value: "object_id" },
						{ label: "Name", value: "name" },
						{ label: "Model", value: "model" },
						{ label: "Kind", value: "kind" },
						{ label: "Category", value: "category" },
						{ label: "Resolution", value: "resolution" },
						{ label: "Start", value: "start" },
						{ label: "End", value: "end" },
						{ label: "Status", value: "ampel" },
					],
					content: [{ ...props.data.details.data, ...props.data.entity.data }],
				},
				{
					sheet: "Locations",
					columns: standardRelation,
					content: props.data.details.data.locations,
				},
				{
					sheet: "Hierarchy",
					columns: standardRelation,
					content: props.data.details.data.hierarchy,
				},
				{
					sheet: "Personnel",
					columns: [
						{ label: "Function", value: "relation_type" },
						{ label: "Name", value: "target.name" },
						{ label: "ID", value: "target.object_id" },
						{ label: "Start", value: "start_date" },
						{ label: "End", value: "end_date" },
					],
					content: props.data.details.data.personnel,
				},
			],
			options: {
				fileName: `${props.data.entity.data.name} - Court`,
			},
		};
		break;
	case "viecpro_institutions":
		xlsxData = {
			sheets: [
				{
					sheet: "Base",
					columns: [
						{ label: "ID", value: "object_id" },
						{ label: "Name", value: "name" },
						{ label: "Model", value: "model" },
						{ label: "Kind", value: "kind" },
						{ label: "Category", value: "category" },
						{ label: "Resolution", value: "resolution" },
						{ label: "Start", value: "start" },
						{ label: "End", value: "end" },
						{ label: "Status", value: "ampel" },
					],
					content: [{ ...props.data.details.data, ...props.data.entity.data }],
				},
				{
					sheet: "Alternative Names",
					columns: [
						{ label: "Name", value: "name" },
						{ label: "Start", value: "start_date" },
						{ label: "End", value: "end_date" },
					],
					content: props.data.details.data.alternative_names,
				},
				{
					sheet: "Locations",
					columns: standardRelation,
					content: props.data.details.data.locations,
				},
				{
					sheet: "Hierarchy",
					columns: standardRelation,
					content: props.data.details.data.hierarchy,
				},
				{
					sheet: "Personnel",
					columns: [
						{ label: "Function", value: "relation_type" },
						{ label: "Name", value: "target.name" },
						{ label: "ID", value: "target.object_id" },
						{ label: "Start", value: "start_date" },
						{ label: "End", value: "end_date" },
					],
					content: props.data.details.data.personnel,
				},
			],
			options: {
				fileName: `${props.data.entity.data.name} - Institution`,
			},
		};
		break;
	case "viecpro_persons":
		xlsxData = {
			sheets: [
				{
					sheet: "Base",
					columns: [
						{ label: "ID", value: "object_id" },
						{ label: "First Name", value: "first_name" },
						{ label: "Last Name", value: "name" },
						{ label: "Model", value: "model" },
						{ label: "Gender", value: "gender" },
						{ label: "Kind", value: "kind" },
						{ label: "Birth", value: "start" },
						{ label: "Place of Birth", value: "place_of_birth.name" },
						{ label: "Death", value: "end" },
						{ label: "Place of Death", value: "place_of_death.name" },
						{ label: "Status", value: "ampel" },
					],
					content: [{ ...props.data.details.data, ...props.data.entity.data }],
				},
				{
					sheet: "Duplicates",
					columns: standardRelation,
					content: props.data.details.data.duplicates,
				},
				{
					sheet: "Alternative Names",
					columns: [
						{ label: "First Names", value: "first_name" },
						{ label: "Last Names", value: "name" },
						{ label: "Married Names", value: "married_name" },
					],
					content: Array.apply(
						null,
						Array(
							Math.max(
								props.data.details.data.alternative_last_names.length,
								props.data.details.data.alternative_first_names.length,
								props.data.details.data.married_names.length,
							),
						),
					).map((x, i) => ({
						first_name: props.data.details.data.alternative_first_names[i],
						name: props.data.details.data.alternative_last_names[i],
						married_name: props.data.details.data.married_names[i],
					})),
				},
				{
					sheet: "Academic Titles",
					columns: [
						{ label: "Title", value: "name" },
						{ label: "Start", value: "start_date" },
						{ label: "End", value: "end_date" },
					],
					content: props.data.details.data.academic_titles,
				},
				{
					sheet: "Honorary Titles",
					columns: [
						{ label: "Title", value: "name" },
						{ label: "Start", value: "start_date" },
						{ label: "End", value: "end_date" },
					],
					content: props.data.details.data.honorary_titles,
				},
				{
					sheet: "Court Functions",
					columns: [
						{ label: "Function", value: "relation_type" },
						{ label: "Name", value: "target.name" },
						{ label: "ID", value: "target.object_id" },
						{ label: "Start", value: "start_date" },
						{ label: "End", value: "end_date" },
					],
					content: props.data.details.data.court_functions,
				},
				{
					sheet: "Court Relations to People",
					columns: standardRelation,
					content: props.data.details.data.person_relations_court,
				},
				{
					sheet: "Other Court Relations",
					columns: [
						{ label: "Name", value: "target.name" },
						{ label: "Start", value: "start_date" },
						{ label: "End", value: "end_date" },
					],
					content: props.data.details.data.other_relations_court,
				},
				{
					sheet: "Marriages and Family",
					columns: standardRelation,
					content: props.data.details.data.marriages_and_family_relations,
				},
				{
					sheet: "Relations to Church and Orders",
					columns: standardRelation,
					content: props.data.details.data.relations_to_church_and_orders,
				},
				{
					sheet: "Non Court Functions",
					columns: standardRelation,
					content: props.data.details.data.non_court_functions,
				},
			],
			options: {
				fileName: `${props.data.entity.data.fullname} - Person`,
			},
		};
		break;
	case "viecpro_places":
		xlsxData = {
			sheets: [
				{
					sheet: "Base",
					columns: [
						{ label: "ID", value: "object_id" },
						{ label: "Name", value: "name" },
						{ label: "Model", value: "model" },
						{ label: "Kind", value: "kind" },
						{ label: "Latitude", value: "lat" },
						{ label: "Longitude", value: "long" },
						{ label: "Start", value: "start" },
						{ label: "End", value: "end" },
						{ label: "Status", value: "ampel" },
					],
					content: [{ ...props.data.details.data, ...props.data.entity.data }],
				},
				{
					sheet: "Related Institutions",
					columns: standardRelation,
					content: props.data.details.data.institution_relations,
				},
				{
					sheet: "Related People",
					columns: standardRelation,
					content: props.data.details.data.person_relations,
				},
				{
					sheet: "Related Places",
					columns: standardRelation,
					content: props.data.details.data.place_relations,
				},
			],
			options: {
				fileName: `${props.data.entity.data.name} - Place`,
			},
		};
		break;
	default:
		break;
}

const downloadXlsx = () => {
	dXlsx(xlsxData.sheets, xlsxData.options);
};
</script>

<template>
	<button @click="downloadXlsx">
		<span class="sr-only">Download as .XLSX</span>
		<FileSpreadsheet class="m-2 h-6 w-6 shrink-0" />
		<span class="mx-auto text-xs text-gray-600">.xlsx</span>
	</button>
</template>
