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
		apiKey: "8DaiGhOWHR9HuaZ3HDM9YqQlF0RCrXy8", // read, get & retrieve only
		connectionTimeoutSeconds: 3,
	});

	return tsClient;
}
