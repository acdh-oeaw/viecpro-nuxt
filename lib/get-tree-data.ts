interface TreeQuery {
	direction?: string;
	show?: string;
	model: string;
	id: string;
}

interface TreeMeta {
	end: string;
	entity_type: string;
	label: string;
	pk: number;
	start: string;
	url: string;
}

export interface TreeEntity {
	name: string;
	meta: TreeMeta;
	children?: Array<TreeEntity>;
}

interface ReturnTree {
	graph_type: string;
	tree_data: TreeEntity;
}

export async function getTreeData(q: TreeQuery) {
	const data = await fetch(
		`https://viecpro-backend.acdh-ch-dev.oeaw.ac.at/visualisations/api/
			${q.model}/
			${q.id}/
			${q.show ?? "normal"}/
			${q.direction ?? "down"}
		`,
	);
	const ret = (await data.json()) as ReturnTree;

	return ret.tree_data;
}
