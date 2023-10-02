import { type SearchParams, type SearchResponse } from "typesense/lib/Typesense/Documents";

import { useDefaultClient } from "@/lib/get-ts-data";

export async function getDocuments<CollectionEntry extends Record<string, Document>>(
	query: SearchParams,
	collection: string,
): Promise<SearchResponse<CollectionEntry>> {
	return useDefaultClient().collections<CollectionEntry>(collection).documents().search(query);
}
