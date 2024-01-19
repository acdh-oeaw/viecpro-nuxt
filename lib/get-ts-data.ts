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
		apiKey: "GrG9AsDjS3Xe3eujXWNN1YDmoN2fmlqU", // read, get & retrieve only
		connectionTimeoutSeconds: 3,
	});

	return tsClient;
}
