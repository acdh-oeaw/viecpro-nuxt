<script lang="ts" setup>
import dXlsx from "json-as-xlsx";
import { FileSpreadsheet } from "lucide-vue-next";

import type { AnyEntity, Court, Person } from "@/types/schema";

const props = defineProps<{
	data: Array<AnyEntity>;
	collection:
		| "viecpro_courts"
		| "viecpro_events"
		| "viecpro_institutions"
		| "viecpro_persons"
		| "viecpro_places"
		| "viecpro_relations";
}>();

const sheet = {
	viecpro_courts: {
		sheet: "Courts",
		columns: [
			{ label: "ID", value: "object_id" },
			{ label: "Name", value: "name" },
			{ label: "Alternative Name", value: (row: Court) => row.alternativenames.join(", ") },
			{ label: "Model", value: "model" },
			{ label: "Kind", value: "kind" },
			{ label: "Category", value: "kategorie" },
			{ label: "Start", value: "start" },
			{ label: "End", value: "end" },
		],
		content: props.data,
	},
	viecpro_institutions: {
		sheet: "Institutions",
		columns: [
			{ label: "ID", value: "object_id" },
			{ label: "Name", value: "name" },
			{ label: "Alternative Name", value: (row: Court) => row.alternativenames.join(", ") },
			{ label: "Model", value: "model" },
			{ label: "Kind", value: "kind" },
			{ label: "Start", value: "start" },
			{ label: "End", value: "end" },
			{ label: "Staus", value: "ampel" },
		],
		content: props.data,
	},
	viecpro_events: {
		sheet: "Events",
		columns: [
			{ label: "ID", value: "object_id" },
			{ label: "Name", value: "name" },
			{ label: "Alternative Name", value: (row: Court) => row.alternativenames.join(", ") },
			{ label: "Model", value: "model" },
			{ label: "Kind", value: "kind" },
			{ label: "Start", value: "start" },
			{ label: "End", value: "end" },
			{ label: "Staus", value: "ampel" },
		],
		content: props.data,
	},
	viecpro_persons: {
		sheet: "People",
		columns: [
			{ label: "ID", value: "object_id" },
			{ label: "First Name", value: "first_name" },
			{ label: "Surname", value: "name" },
			{ label: "Functions", value: (row: Person) => row.functions.join(", ") },
			{ label: "Institutions", value: (row: Person) => row.institutions.join(", ") },
			{ label: "Alternative Name", value: (row: Person) => row.alternativenames.join(", ") },
			{ label: "Model", value: "model" },
			{ label: "Kind", value: "kind" },
			{ label: "Birth", value: "start" },
			{ label: "Death", value: "end" },
			{ label: "Gender", value: "gender" },
			{ label: "Staus", value: "ampel" },
		],
		content: props.data,
	},
	viecpro_places: {
		sheet: "Places",
		columns: [
			{ label: "ID", value: "object_id" },
			{ label: "Name", value: "name" },
			{ label: "Alternative Name", value: (row: Person) => row.alternativenames.join(", ") },
			{ label: "Model", value: "model" },
			{ label: "Kind", value: "kind" },
			{ label: "Start", value: "start" },
			{ label: "End", value: "end" },
			{ label: "Latitude", value: "lat" },
			{ label: "Longitude", value: "long" },
		],
		content: props.data,
	},
	viecpro_relations: {
		sheet: "Relations",
		columns: [
			{ label: "Relation ID", value: "object_id" },

			{ label: "Source ID", value: "source.object_id" },
			{ label: "Source Model", value: "source.model" },
			{ label: "Source Name", value: "source.name" },

			{ label: "Relation Type", value: "relation_type" },

			{ label: "Target Name", value: "target.name" },
			{ label: "Target Model", value: "target.model" },
			{ label: "Target ID", value: "target.object_id" },
		],
		content: props.data,
	},
};

const xlsxData = {
	sheets: [sheet[props.collection]],
	options: {
		fileName: props.collection,
	},
};

const downloadXlsx = () => {
	dXlsx(xlsxData.sheets, xlsxData.options);
};
</script>

<template>
	<button @click="downloadXlsx">
		<span class="sr-only">Download as .XLSX</span>
		<FileSpreadsheet class="m-2 h-6 w-6 shrink-0" />
	</button>
</template>
