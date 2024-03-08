import type { Icon } from "lucide-vue-next";

import type { NuxtLinkProps } from "#app";

export interface NavLink {
	href: NuxtLinkProps["href"];
	label: string;
	icon?: Icon;
}

export interface HierarchyNode {
	group: string;
	label: string;
	pk: number;
	value?: Array<number | string>;
}
