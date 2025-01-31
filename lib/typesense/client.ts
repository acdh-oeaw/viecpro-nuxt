import { Client } from "typesense";

import { env } from "@/config/env.config";

export function createClient(): Client {
	const client = new Client({
		apiKey: env.NEXT_PUBLIC_TYPESENSE_SEARCH_API_KEY,
		// cacheSearchResultsForSeconds: 2 * 60,
		connectionTimeoutSeconds: 10,
		nodes: [
			{
				host: env.NEXT_PUBLIC_TYPESENSE_HOST,
				port: env.NEXT_PUBLIC_TYPESENSE_PORT,
				protocol: env.NEXT_PUBLIC_TYPESENSE_PROTOCOL,
			},
		],
		// useServerSideSearchCache: false,
	});

	return client;
}

export const client = createClient();
