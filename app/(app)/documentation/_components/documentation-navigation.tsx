import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { NavLink } from "@/components/nav-link";
import { createSingletonResource } from "@/lib/keystatic/resources";

export async function DocumentationNavigation(): Promise<ReactNode> {
	const locale = await getLocale();
	const t = await getTranslations("DocumentationNavigation");

	const nav = await createSingletonResource("documentation-nav", locale).read();

	return (
		<nav aria-label={t("documentation")} className="grid gap-y-3">
			<h2 className="text-xs font-bold tracking-wider text-brand-600 uppercase">{t("contents")}</h2>
			<ul className="grid gap-y-1 text-brand-600" role="list">
				{nav.data.links.map((link) => {
					return (
						<li key={link.id}>
							<NavLink
								className="hover:underline focus-visible:focus-outline aria-[current]:font-medium"
								href={`/documentation/${link.id}`}
							>
								{link.label}
							</NavLink>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
