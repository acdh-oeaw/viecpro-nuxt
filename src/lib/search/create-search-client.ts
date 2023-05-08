import { type SearchClient } from "instantsearch.js";
import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";

import { type Collection, collections } from "@/lib/search/collections.config";
import { getPrefixedCollection } from "@/lib/search/get-prefixed-collection";
import { env } from "~/config/env.config";

const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
	server: {
		apiKey: env.NUXT_PUBLIC_TYPESENSE_API_KEY,
		nodes: [
			{
				host: env.NUXT_PUBLIC_TYPESENSE_HOST,
				port: env.NUXT_PUBLIC_TYPESENSE_PORT,
				protocol: env.NUXT_PUBLIC_TYPESENSE_PROTOCOL,
			},
		],
		cacheSearchResultsForSeconds: 2 * 60,
	},
	collectionSpecificSearchParameters: Object.fromEntries(
		Object.entries(collections).map(([collection, config]) => {
			return [getPrefixedCollection(collection as Collection), config.searchParams];
		}),
	),
});

export function createSearchClient(): SearchClient {
	const searchClient = typesenseInstantsearchAdapter.searchClient;

	return searchClient;
}
