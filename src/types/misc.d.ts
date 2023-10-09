import { type Icon } from "lucide-vue-next";

import { type NuxtLinkProps } from "#app";

export type NavLink = {
	href: NuxtLinkProps["href"];
	label: string;
	icon?: Icon;
};
