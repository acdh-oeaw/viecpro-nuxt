import { type SearchResponse } from "typesense/lib/Typesense/Documents";

import { getDocumentAndRelations } from "@/composables/use-ts-data";
import { type Person, type Relation } from "@/lib/schema.types";

interface Field {
	headers: Array<string>;
	data: Array<object>;
	cols?: string;
}
interface dataObject {
	[index: string]: Field | string;
	first_name: string;
	name: string;
	fullname: string;
	gender: string;
	start_date: string;
	end_date: string;
	duplicates: Field;
	alt_names: Field;
	nobility: Field;
	titles: Field;
	married_name: Field;
	download: Field;
	functions: Field;
	colleagues: Field;
	court_other: Field;
	family: Field;
	religion: string;
	churches: Field;
	first_marriage: string;
	other_jobs: Field;
}
const defaultField: Field = {
	headers: [],
	data: [],
};

export async function getPersonDetails(id: string): Promise<dataObject> {
	const response = (await getDocumentAndRelations("Person_", `viecpro_persons`, id, "Person")) as {
		entity: Person;
		source: SearchResponse<Relation>;
		target: SearchResponse<Relation>;
	};

	const ret: dataObject = {
		first_name: response.entity.first_name ?? "",
		name: response.entity.name ?? "",
		fullname: response.entity.fullname,
		gender: response.entity.gender ?? "",
		start_date: response.entity.start_date,
		end_date: response.entity.end_date,
		duplicates: { headers: ["ID", "Name"], cols: "grid-cols-2", data: [] },
		alt_names: {
			headers: ["Header", "Name", "Clean Name", "Start", "Ende"],
			data: [],
			cols: "grid-cols-5",
		},
		nobility: defaultField,
		married_name: {
			headers: ["Name", "Start", "End"],
			cols: "grid-cols-[1fr_auto_auto]",
			data: [],
		},
		titles: { headers: ["Name", "Start", "End"], cols: "grid-cols-[1fr_auto_auto]", data: [] },
		download: defaultField,
		functions: { headers: ["Name", "Start", "End"], cols: "grid-cols-[1fr_auto_auto]", data: [] },
		colleagues: defaultField,
		court_other: { headers: ["Name", "Start", "End"], cols: "grid-cols-[1fr_auto_auto]", data: [] },
		family: defaultField,
		first_marriage: "",
		religion: "",
		churches: {
			headers: ["Name", "Art", "Start", "End"],
			cols: "grid-cols-[1fr_1fr_auto_auto]",
			data: [],
		},
		other_jobs: { headers: ["Name", "Start", "End"], cols: "grid-cols-[1fr_auto_auto]", data: [] },
	};

	const check = (lt: Array<string> | undefined, check_val: string) => {
		if (!lt) return false;
		return lt.includes(check_val);
	};

	if (response.entity.labels) {
		response.entity.labels.forEach((label) => {
			const l = { ...label };
			const lt = l.label_type;

			if (check(lt, "name")) {
				ret.alt_names.data.push({
					label_type: lt,
					name: l.name,
					name_clean: l.name?.replace("Schreibvariante", ""),
					start_date: l.start_date,
					end_date: l.end_date,
				});
			}
			if (check(lt, "Konfession")) {
				ret.religion = l.name ?? "";
			}
			if (check(lt, "Adelstitel")) {
				ret.titles.data.push({
					name: l.name,
					start_date: l.start_date,
					end_date: l.end_date,
				});
			}
			if (check(lt, "verheiratet")) {
				ret.married_name.data.push({
					name: l.name,
					start_date: l.start_date,
					end_date: l.end_date,
				});
			}
			if (check(lt, "Nachname verheiratet (1. Ehe")) {
				ret.first_marriage = l.name ?? "";
			}
			if (check(lt, "Sonstiger Hofbezug")) {
				ret.court_other.data.push({ name: l.name, start_date: l.start_date, end_date: l.end_date });
			}
			if (check(lt, "Akade")) {
				ret.titles.data.push({
					name: l.name,
					start_date: l.start_date,
					end_date: l.end_date,
				});
			}
			if (check(lt, "Funktion, Amtsinhabe und Beruf")) {
				ret.other_jobs.data.push({ name: l.name, start_date: l.start_date, end_date: l.end_date });
			}
			if (check(lt, "Stand")) {
				ret.titles.data.push({
					name: l.name,
					start_date: l.start_date,
					end_date: l.end_date,
				});
			}
			if (check(lt, "Auszeichnung")) {
				ret.titles.data.push({
					name: l.name,
					start_date: l.start_date,
					end_date: l.end_date,
				});
			}
			if (check(lt, "Kirche")) {
				ret.churches.data.push({
					name: l.name,
					art: l.label_type,
					start_date: l.start_date,
					end_date: l.end_date,
				});
			}
			if (check(lt, "Orden")) {
				ret.churches.data.push({
					name: l.name,
					art: l.label_type,
					start_date: l.start_date,
					end_date: l.end_date,
				});
			}
		});
	}

	if (response.source.hits) {
		response.source.hits.forEach((hit) => {
			if (hit.document.model === "PersonInstitution") {
				ret.functions.data.push({
					name: hit.document.relation_type,
					inst: hit.document.target.name,
					start: hit.document.start_date,
					end: hit.document.end_date,
				});
			}

			if (hit.document.relation_type.includes("Doublette")) {
				ret.duplicates.data.push({
					id: hit.document.target.object_id,
					name: hit.document.target.name,
				});
			}
		});
	}

	return ret;
}
