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
		apiKey: "anVMf3luK4BuppA6NlFB4nSSnHIfkZC2", // read, get & retrieve only
		connectionTimeoutSeconds: 3,
	});

	return tsClient;
}
