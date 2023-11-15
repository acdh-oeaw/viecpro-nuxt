import { type SearchResponse } from "typesense/lib/Typesense/Documents";

import { getDocumentAndRelations } from "@/composables/use-ts-data";
import { type Person, type Relation } from "@/lib/schema.types";

export const getPersonDetails: {
	[index: string]: object;
	duplicates: object;
	alt_names: object;
	nobility: object;
	titles: object;
	download: object;
	functions: object;
	colleagues: object;
	other: object;
	family: object;
	church: object;
	others2: object; //TODO find better name
} = async (id: string) => {
	const ret = {
		duplicates: {},
		alt_names: {},
		nobility: {},
		titles: {},
		download: {},
		functions: {},
		colleagues: {},
		other: {},
		family: {},
		church: {},
		others2: {},
	};

	const response = (await getDocumentAndRelations("Person_", `viecpro_persons`, id, "Person")) as {
		entity: Person;
		source: SearchResponse<Relation>;
		target: SearchResponse<Relation>;
	};

	ret.functions = {
		headers: ["Bezeichnung", "Institution", "Von", "Bis"],
		data: response.source.hits
			? response.source.hits
					.filter((hit) => {
						return hit.document.model === "PersonInstitution";
					})
					.map((hit) => {
						return [
							hit.document.relation_type,
							hit.document.target.name,
							hit.document.start_date,
							hit.document.end_date,
						];
					})
			: [],
	};

	return ret;
};
