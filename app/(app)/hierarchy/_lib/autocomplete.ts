import { createUrl, request } from "@acdh-oeaw/lib";

import { env } from "@/config/env.config";

interface AutocompleteData {
	context: Array<{
		group: "Funktion" | "Institution" | "Person";
		label: string;
		pk: number;
		/** [label, group, pk] */
		value: [string, string, number];
	}>;
}

export const groups = {
	Funktion: "function",
	Institution: "institution",
	Person: "person",
} as const;

export interface AutocompleteItem {
	kind: "function" | "institution" | "person";
	id: number;
	label: string;
}

/**
 * Actually, this returns *all* entries in a 5MB payload.
 *
 * @see https://github.com/acdh-oeaw/viecpro-backend-devops/blob/main/viecpro_hierarchy/views.py
 */
export async function getAutocompleteData(): Promise<Map<number, AutocompleteItem>> {
	const url = createUrl({
		baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
		pathname: "/visualisations/entityautocomplete/",
	});

	const data = (await request(url, { responseType: "json" })) as AutocompleteData;

	const items = new Map<number, AutocompleteItem>();

	data.context.forEach((entry) => {
		// FIXME: note that pk/id is stringified in all other viecpro collections,
		// so we might want to do this here as well.
		const item: AutocompleteItem = {
			kind: groups[entry.group],
			id: entry.pk,
			label: entry.label,
		};

		items.set(item.id, item);
	});

	return items;
}
