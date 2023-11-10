import { Client } from "typesense";

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

export function useDefaultClient(): Client {
	return tsClient;
}
