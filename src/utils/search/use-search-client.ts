import { type SearchClient } from "instantsearch.js";
import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";

import { type Collection, collections } from "@/utils/search/collections.config";
import { usePrefixedCollection } from "@/utils/search/use-prefixed-collection";

export function useSearchClient(): SearchClient {
	const env = useRuntimeConfig();

	const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
		server: {
			apiKey: env.public.NUXT_PUBLIC_TYPESENSE_API_KEY,
			nodes: [
				{
					host: env.public.NUXT_PUBLIC_TYPESENSE_HOST,
					port: Number(env.public.NUXT_PUBLIC_TYPESENSE_PORT),
					protocol: env.public.NUXT_PUBLIC_TYPESENSE_PROTOCOL,
				},
			],
			cacheSearchResultsForSeconds: 2 * 60,
		},
		collectionSpecificSearchParameters: Object.fromEntries(
			Object.entries(collections).map(([collection, config]) => {
				return [usePrefixedCollection(collection as Collection), config.searchParams];
			}),
		),
	});

	const searchClient = typesenseInstantsearchAdapter.searchClient;

	return searchClient;
}
