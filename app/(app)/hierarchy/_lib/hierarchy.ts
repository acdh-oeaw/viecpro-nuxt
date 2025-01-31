import { assert, createUrl, request } from "@acdh-oeaw/lib";
import * as v from "valibot";

import { env } from "@/config/env.config";

export const defaultSearchFilters = {
	direction: "down",
	graph: "default",
} as const;

export const graphs = {
	function: ["default", "show amt and persons"],
	institution: ["default", "add functions", "add functions and persons"],
	person: ["default"],
} as const;

export const SearchFiltersSchema = v.pipe(
	v.object({
		kind: v.optional(v.picklist(["institution", "person", "function"])),
		id: v.optional(v.pipe(v.string(), v.transform(Number), v.number(), v.integer(), v.minValue(1))),
		direction: v.optional(v.picklist(["up", "down"]), defaultSearchFilters.direction),
		graph: v.optional(v.string(), defaultSearchFilters.graph),
	}),
	v.check((input) => {
		/** @see https://github.com/acdh-oeaw/viecpro-backend-devops/blob/main/viecpro_hierarchy/api_views.py */
		switch (input.kind) {
			case "institution": {
				return v.safeParse(v.picklist(graphs.institution), input.graph).success;
			}

			case "person": {
				return v.safeParse(v.picklist(graphs.person), input.graph).success;
			}

			case "function": {
				return v.safeParse(v.picklist(graphs.function), input.graph).success;
			}

			case undefined: {
				return input.graph === defaultSearchFilters.graph;
			}
		}
	}),
);

export type SearchFilters = v.InferOutput<typeof SearchFiltersSchema>;

export function getSearchFilters(searchParams: SearchParams): SearchFilters {
	return v.parse(SearchFiltersSchema, searchParams);
}

export interface GraphNode {
	name: string;
	meta: {
		end: string;
		entity_type: "Institution" | "Person" | "Funktion";
		label: string;
		/** Id. */
		pk: number;
		start: string;
		/** Entity details. */
		url: string;
	};
	children: Array<GraphNode>;
}

interface GraphData {
	graph_type: string;
	tree_data: GraphNode;
}

const kinds = {
	person: "Person",
	institution: "Institution",
	function: "Funktion",
} as const;

const graphEndpoints: Record<string, string> = {
	default: "normal",
	"add functions": "add functions",
	"add functions and persons": "add functions and persons",
	"show amt and persons": "show amt and persons",
} as const;

export async function getSearchResults(searchFilters: SearchFilters): Promise<GraphNode> {
	assert(searchFilters.kind != null, "Missing entity kind.");
	assert(searchFilters.id != null, "Missing entity id.");

	const { kind, id, graph, direction } = searchFilters;

	const url = createUrl({
		baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
		/** Note that the endpoint does *not* work with a trailing slash. */
		pathname: `/visualisations/api/${kinds[kind]}/${String(id)}/${graphEndpoints[graph] ?? graph}/${direction}`,
	});

	const data = (await request(url, { responseType: "json" })) as GraphData;

	const tree = data.tree_data;

	return tree;
}
