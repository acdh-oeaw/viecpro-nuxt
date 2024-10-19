import { assert, isNonEmptyString } from "@acdh-oeaw/lib";
import { Client } from "typesense";

export function useTypesenseClient(): Client {
	const env = useRuntimeConfig();

	assert(isNonEmptyString(env.public.typesenseHost), "Missing typesense host.");
	assert(isNonEmptyString(env.public.typesensePort), "Missing typesense port.");
	assert(isNonEmptyString(env.public.typesenseProtocol), "Missing typesense protocol.");
	assert(isNonEmptyString(env.public.typesenseApiKey), "Missing typesense api key.");

	const client = new Client({
		apiKey: env.public.typesenseApiKey,
		connectionTimeoutSeconds: 3,
		nodes: [
			{
				host: env.public.typesenseHost,
				port: Number(env.public.typesensePort),
				protocol: env.public.typesenseProtocol,
			},
		],
	});

	return client;
}
