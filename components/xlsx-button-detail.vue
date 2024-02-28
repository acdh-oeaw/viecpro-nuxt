<script lang="ts" setup>
import dXlsx, { type IJsonSheet } from "json-as-xlsx";
import { FileSpreadsheet } from "lucide-vue-next";

import type {
	AnyDetail,
	AnyEntity,
	CourtDetail,
	DetailLabel,
	GenericRelation,
	InstitutionDetail,
	Person,
	PersonDetail,
	PlaceDetail,
} from "@/types/schema";

const props = defineProps<{
	data: {
		entity: { data: AnyEntity };
		details: { data: AnyDetail };
	};
	collection:
		| "viecpro_courts"
		| "viecpro_events"
		| "viecpro_institutions"
		| "viecpro_persons"
		| "viecpro_places"
		| "viecpro_references"
		| "viecpro_relations";
}>();

const standardRelation = [
	{ label: "Relation Type", value: "relation_type" },
	{ label: "Name", value: "target.name" },
	{ label: "ID", value: "target.object_id" },
	{ label: "Start", value: "start_date" },
	{ label: "End", value: "end_date" },
];
let xlsxData: {
	sheets: Array<{
		sheet: string;
		columns: Array<{ label: string; value: string }>;
		content: Array<AnyDetail | AnyEntity | DetailLabel | GenericRelation | object>;
	}>;
	options: { fileName: string };
};

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
					content: (props.data.details.data as CourtDetail).locations,
				},
				{
					sheet: "Hierarchy",
					columns: standardRelation,
					content: (props.data.details.data as CourtDetail).hierarchy,
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
					content: (props.data.details.data as CourtDetail).personnel,
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
					content: (props.data.details.data as InstitutionDetail).alternative_names,
				},
				{
					sheet: "Locations",
					columns: standardRelation,
					content: (props.data.details.data as InstitutionDetail).locations,
				},
				{
					sheet: "Hierarchy",
					columns: standardRelation,
					content: (props.data.details.data as InstitutionDetail).hierarchy,
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
					content: (props.data.details.data as InstitutionDetail).personnel,
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
					content: (props.data.details.data as PersonDetail).duplicates,
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
								(props.data.details.data as PersonDetail).alternative_last_names.length,
								(props.data.details.data as PersonDetail).alternative_first_names.length,
								(props.data.details.data as PersonDetail).married_names.length,
							),
						),
					).map((x, i) => ({
						first_name: (props.data.details.data as PersonDetail).alternative_first_names[i],
						name: (props.data.details.data as PersonDetail).alternative_last_names[i],
						married_name: (props.data.details.data as PersonDetail).married_names[i],
					})),
				},
				{
					sheet: "Academic Titles",
					columns: [
						{ label: "Title", value: "name" },
						{ label: "Start", value: "start_date" },
						{ label: "End", value: "end_date" },
					],
					content: (props.data.details.data as PersonDetail).academic_titles,
				},
				{
					sheet: "Honorary Titles",
					columns: [
						{ label: "Title", value: "name" },
						{ label: "Start", value: "start_date" },
						{ label: "End", value: "end_date" },
					],
					content: (props.data.details.data as PersonDetail).honorary_titles,
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
					content: (props.data.details.data as PersonDetail).court_functions,
				},
				{
					sheet: "Court Relations to People",
					columns: standardRelation,
					content: (props.data.details.data as PersonDetail).person_relations_court,
				},
				{
					sheet: "Other Court Relations",
					columns: [
						{ label: "Name", value: "target.name" },
						{ label: "Start", value: "start_date" },
						{ label: "End", value: "end_date" },
					],
					content: (props.data.details.data as PersonDetail).other_relations_court,
				},
				{
					sheet: "Marriages and Family",
					columns: standardRelation,
					content: (props.data.details.data as PersonDetail).marriages_and_family_relations,
				},
				{
					sheet: "Relations to Church and Orders",
					columns: standardRelation,
					content: (props.data.details.data as PersonDetail).relations_to_church_and_orders,
				},
				{
					sheet: "Non Court Functions",
					columns: standardRelation,
					content: (props.data.details.data as PersonDetail).non_court_functions,
				},
			],
			options: {
				fileName: `${(props.data.entity.data as Person).fullname} - Person`,
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
					content: (props.data.details.data as PlaceDetail).institution_relations,
				},
				{
					sheet: "Related People",
					columns: standardRelation,
					content: (props.data.details.data as PlaceDetail).person_relations,
				},
				{
					sheet: "Related Places",
					columns: standardRelation,
					content: (props.data.details.data as PlaceDetail).place_relations,
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
	dXlsx(xlsxData.sheets as Array<IJsonSheet>, xlsxData.options);
};
</script>

<template>
	<button @click="downloadXlsx">
		<span class="sr-only">Download as .XLSX</span>
		<FileSpreadsheet class="mx-auto w-full shrink-0" />
		<slot />
	</button>
</template>
