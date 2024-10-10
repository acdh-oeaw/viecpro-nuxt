import { Client } from "typesense";

export function useDefaultClient(): Client {
	const env = useRuntimeConfig();

	const tsClient = new Client({
		nodes: [
			{
				host: env.public.typesenseHost,
				port: env.public.typesensePort,
				protocol: env.public.typesenseProtocol,
			},
		],
		apiKey: env.public.typesenseApiKey,
		connectionTimeoutSeconds: 3,
	});

	return tsClient;
}
