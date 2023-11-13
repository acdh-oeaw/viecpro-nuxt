import { Client } from "typesense";

import { useRuntimeConfig } from "#imports";

export function useDefaultClient(): Client {
	const env = useRuntimeConfig();

	const tsClient = new Client({
		nodes: [
			{
				host: env.public.NUXT_PUBLIC_TYPESENSE_HOST,
				port: Number(env.public.NUXT_PUBLIC_TYPESENSE_PORT),
				protocol: env.public.NUXT_PUBLIC_TYPESENSE_PROTOCOL,
			},
		],
		apiKey: env.public.NUXT_PUBLIC_TYPESENSE_API_KEY, // read & retrieve only
		connectionTimeoutSeconds: 3,
	});

	return tsClient;
}
