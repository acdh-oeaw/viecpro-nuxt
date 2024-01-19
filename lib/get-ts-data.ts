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
		apiKey: "qCzoFcTKjI7LNKNxvfB0Km7z614Ix2Vj", // read, get & retrieve only
		connectionTimeoutSeconds: 3,
	});

	return tsClient;
}
