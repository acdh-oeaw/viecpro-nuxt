import { assert } from "@acdh-oeaw/lib";
import { Client } from "typesense";

export function useDefaultClient(): Client {
	const env = useRuntimeConfig();

	assert(env.public.typesenseHost, "Missing typesense host.");
	assert(env.public.typesensePort, "Missing typesense port.");
	assert(env.public.typesenseProtocol, "Missing typesense protocol.");
	assert(env.public.typesenseApiKey, "Missing typesense api key.");

	const tsClient = new Client({
		nodes: [
			{
				host: env.public.typesenseHost,
				port: Number(env.public.typesensePort),
				protocol: env.public.typesenseProtocol,
			},
		],
		apiKey: env.public.typesenseApiKey,
		connectionTimeoutSeconds: 3,
	});

	return tsClient;
}
