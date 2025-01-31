import {
	BookTextIcon,
	CalendarRangeIcon,
	MapPinIcon,
	MedalIcon,
	School2Icon,
	UserIcon,
	UsersIcon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { FC, ReactNode } from "react";

import { SidePanelProvider } from "@/app/(app)/search/_components/side-panel-provider";
import { NavLink, type NavLinkProps } from "@/components/nav-link";
import { createHref } from "@/lib/create-href";

interface SearchLayoutProps {
	children: ReactNode;
}

export default async function SearchLayout(props: Readonly<SearchLayoutProps>): Promise<ReactNode> {
	const { children } = props;

	const t = await getTranslations("SearchLayout");

	const links = {
		persons: {
			label: t("persons"),
			href: createHref({ pathname: "/search/persons" }),
			icon: UserIcon,
			isDisabled: false,
		},
		courts: {
			label: t("courts"),
			href: createHref({ pathname: "/search/courts" }),
			icon: UsersIcon,
			isDisabled: false,
		},
		institutions: {
			label: t("institutions"),
			href: createHref({ pathname: "/search/institutions" }),
			icon: School2Icon,
			isDisabled: false,
		},
		places: {
			label: t("places"),
			href: createHref({ pathname: "/search/places" }),
			icon: MapPinIcon,
			isDisabled: false,
		},
		events: {
			label: t("events"),
			href: createHref({ pathname: "/search/events" }),
			icon: CalendarRangeIcon,
			isDisabled: true,
		},
		functions: {
			label: t("functions"),
			href: createHref({ pathname: "/search/functions" }),
			icon: MedalIcon,
			isDisabled: true,
		},
		bibliography: {
			label: t("bibliography"),
			href: createHref({ pathname: "/documentation/bibliography" }),
			icon: BookTextIcon,
			isDisabled: false,
		},
	} satisfies Record<
		string,
		{ href: NavLinkProps["href"]; label: string; icon: FC; isDisabled: boolean }
	>;

	return (
		<SidePanelProvider>
			<div className="grid grid-cols-[auto_1fr]">
				<div className="z-20 border-r border-brand-100 bg-brand-50">
					<nav aria-label={t("search")} className="mt-14">
						<ul className="grid gap-y-2 text-brand-600" role="list">
							{Object.entries(links).map(([id, link]) => {
								const Icon = link.icon;

								return (
									<li key={id} className="flex">
										<NavLink
											className="focus-visible:focus-outline focus-visible:-focus-outline-offset-2 inline-block aspect-square p-4 transition aria-[current]:bg-brand-100 hover:bg-brand-100 disabled:opacity-50"
											href={link.href}
											isDisabled={link.isDisabled}
											title={link.label}
										>
											<Icon aria-hidden={true} className="size-6 shrink-0" />
											<span className="sr-only">{link.label}</span>
										</NavLink>
									</li>
								);
							})}
						</ul>
					</nav>
				</div>

				{children}
			</div>
		</SidePanelProvider>
	);
}
