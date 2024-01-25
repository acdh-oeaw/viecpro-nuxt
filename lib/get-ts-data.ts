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
		apiKey: "catYoetXCv1rTfAp5LzcQ6TKI48gkB13", // read, get & retrieve only
		connectionTimeoutSeconds: 3,
	});

	return tsClient;
}
