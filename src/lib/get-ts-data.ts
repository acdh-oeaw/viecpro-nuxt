import { Client } from "typesense";

const tsClient = new Client({
	nodes: [
		{
			host: "typesense.acdh-dev.oeaw.ac.at",
			port: 443,
			protocol: "https",
		},
	],
	apiKey: "WFUrFcRl370UM00y6ich86bpdKhBIL1R", // read & retrieve only
	connectionTimeoutSeconds: 3,
});

export function useDefaultClient(): Client {
	return tsClient;
}
