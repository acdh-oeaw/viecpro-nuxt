import { type Collection } from "@/lib/search/collections.config";
import { env } from "~/config/env.config";

export function getPrefixedCollection(collection: Collection): string {
	// FIXME: collections should be plural and lowercase
	const map: Record<Collection, string> = {
		courts: "Hofstaat",
		events: "Event",
		institutions: "Institution",
		persons: "Person",
		places: "Place",
		references: "Reference",
		relations: "Relations",
	};

	return [env.VITE_TYPESENSE_COLLECTION_PREFIX, map[collection]].join("");
}
