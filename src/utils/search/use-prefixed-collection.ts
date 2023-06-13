import { type Collection } from "@/utils/search/collections.config";

export function usePrefixedCollection(collection: Collection): string {
	const env = useRuntimeConfig();

	// FIXME: collections should be english, plural and lowercase
	const map: Record<Collection, string> = {
		courts: "Hofstaat",
		events: "Event",
		institutions: "Institution",
		persons: "Person",
		places: "Place",
		references: "Reference",
		relations: "Relations",
	};

	return [env.public.NUXT_PUBLIC_TYPESENSE_COLLECTION_PREFIX, map[collection]].join("");
}
