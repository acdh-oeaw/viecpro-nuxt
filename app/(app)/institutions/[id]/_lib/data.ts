import { cache } from "react";

import type { Institution } from "@/app/(app)/search/institutions/_lib/search";
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

interface InstitutionDetails extends Institution {
	alternativeNames?: Array<RelationShort>;
	hierarchy: Array<Relation<"institution">> | null;
	locations: Array<Relation<"place">> | null;
	notes: string;
	personnel: Array<Relation<"person">> | null;
	references: Array<Reference> | null;
	sameAs: Array<string> | null;
}

const collection = [env.NEXT_PUBLIC_TYPESENSE_COLLECTION_PREFIX, "institution_detail"].join("");

export const getInstitution = cache(async function getInstitution(id: string) {
	const result = await client.collections<InstitutionDetails>(collection).documents(id).retrieve();
	return result;
});
