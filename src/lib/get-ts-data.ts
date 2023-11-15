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
		apiKey: "cVjFs0UF7K11VSwNSii5VX2N7gbSNN4E", // read & retrieve only
		connectionTimeoutSeconds: 3,
	});

	return tsClient;
}
