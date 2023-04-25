import { type SearchParametersWithQueryBy } from "typesense-instantsearch-adapter";

export const collections = {
	courts: {
		searchParams: { query_by: "name, kind, owner" },
	},
	events: {
		searchParams: { query_by: "name, kind" },
	},
	institutions: {
		searchParams: { query_by: "name, kind" },
	},
	persons: {
		searchParams: { query_by: "first_name, name" },
	},
	places: {
		searchParams: { query_by: "name, kind, lat, long" },
	},
	references: {
		searchParams: { query_by: "related_doc.name, title, shortTitle, folio" },
	},
	relations: {
		searchParams: { query_by: "source.name, target.name, relation_type, model" },
	},
} satisfies Record<string, { searchParams: SearchParametersWithQueryBy }>;

export type Collection = keyof typeof collections;
