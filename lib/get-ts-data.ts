import { Client } from "typesense";

export function useDefaultClient(): Client {
	const tsClient = new Client({
		nodes: [
			{
				host: "typesense.acdh-dev.oeaw.ac.at",
				port: 443,
				protocol: "https",
			},
		],
		apiKey: "nFUaLp9SuREfD8Z5V4YospgXLtXyjfRG", // read, get & retrieve only
		connectionTimeoutSeconds: 3,
	});

	return tsClient;
}
