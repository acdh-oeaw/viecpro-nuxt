import { cache } from "react";

import type { Person } from "@/app/(app)/search/persons/_lib/search";
import { env } from "@/config/env.config";
import { client } from "@/lib/typesense/client";

type Model = "person" | "place" | "institution" | "court" | "event";

interface Entity<TModel extends Model> {
	name: string;
	id: number;
	kind: TModel;
}

interface RelationShort {
	startDate: number | null;
	startDateWritten: string;
	endDate: number | null;
	endDateWritten: string;
	relationType: string;
}

interface Relation<TModel extends Model = Model> extends RelationShort {
	target: Entity<TModel>;
}

interface Reference {
	end_page: number | null;
	folio: string | null;
	id: number;
	kind: string;
	shortTitle: string;
	start_page: number | null;
	tag: string;
	title: string;
}

interface PersonDetails extends Person {
	academicTitles?: Array<RelationShort>;
	allowance?: Array<string>;
	alternativeBirthDates?: Array<string>;
	alternativeDeathDates?: Array<string>;
	alternativeFirstNames?: Array<string>;
	alternativeLastNames?: Array<string>;
	confession?: Array<string>;
	courtFunctions?: Array<Relation>;
	duplicates: Array<Relation> | null;
	firstMarriage?: string;
	hadCourts: Array<Entity<"institution">> | null;
	honoraryTitles: Array<RelationShort> | null;
	marriagesAndFamilyRelations: Array<Relation> | null;
	marriedNames: Array<RelationShort> | null;
	nonCourtFunctions: Array<RelationShort | Relation> | null;
	notes: string;
	otherRelationsCourt: Array<RelationShort> | null;
	personRelationsCourt: Array<Relation> | null;
	placeOfBirth: Entity<"place"> | null;
	placeOfDeath: Entity<"place"> | null;
	references: Array<Reference> | null;
	relatedPlaces: Array<Relation<"place">> | null;
	relationsToChurchAndOrders: Array<RelationShort | Relation> | null;
	sameAs: Array<string> | null;
}

const collection = [env.NEXT_PUBLIC_TYPESENSE_COLLECTION_PREFIX, "person_detail"].join("");

export const getPerson = cache(async function getPerson(id: string) {
	const result = await client.collections<PersonDetails>(collection).documents(id).retrieve();
	return result;
});
