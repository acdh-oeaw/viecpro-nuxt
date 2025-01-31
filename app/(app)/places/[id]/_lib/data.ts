import { cache } from "react";

import type { Place } from "@/app/(app)/search/places/_lib/search";
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

interface PlaceDetails extends Place {
	alternativeNames?: Array<RelationShort>;
	institutionRelations: Array<Relation<"institution">> | null;
	latitude: number | null;
	longitude: number | null;
	notes: string;
	personRelations: Array<Relation<"person">> | null;
	placeRelations: Array<Relation<"place">> | null;
	references: Array<Reference> | null;
	sameAs: Array<string> | null;
}

const collection = [env.NEXT_PUBLIC_TYPESENSE_COLLECTION_PREFIX, "place_detail"].join("");

export const getPlace = cache(async function getPlace(id: string) {
	const result = await client.collections<PlaceDetails>(collection).documents(id).retrieve();
	return result;
});
