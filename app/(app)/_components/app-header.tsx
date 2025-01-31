import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import {
	AppNavigation,
	AppNavigationMobile,
	type NavigationItem,
} from "@/app/(app)/_components/app-navigation";
import { createHref } from "@/lib/create-href";

export function AppHeader(): ReactNode {
	const t = useTranslations("AppHeader");

	const label = t("navigation-primary");

	const navigation = {
		home: {
			type: "link",
			href: createHref({ pathname: "/" }),
			label: t("links.home"),
			isCurrent: "exact",
		},
		search: {
			type: "link",
			href: createHref({ pathname: "/search" }),
			label: t("links.search"),
			isCurrent: "group",
		},
		hierarchy: {
			type: "link",
			href: createHref({ pathname: "/hierarchy" }),
			label: t("links.hierarchy"),
			isCurrent: "exact",
		},
		documentation: {
			type: "link",
			href: createHref({ pathname: "/documentation" }),
			label: t("links.documentation"),
			isCurrent: "group",
		},
	} satisfies Record<string, NavigationItem>;

	return (
		<header className="border-b-4 border-brand-900 bg-brand-600 text-white">
			<div className="flex justify-between gap-x-12 px-8">
				<AppNavigation label={label} navigation={navigation} />
				<AppNavigationMobile
					label={label}
					menuCloseLabel={t("navigation-menu-close")}
					menuOpenLabel={t("navigation-menu-open")}
					menuTitleLabel={t("navigation-menu")}
					navigation={navigation}
				/>
			</div>
		</header>
	);
}
