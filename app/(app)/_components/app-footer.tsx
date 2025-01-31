import { cn } from "@acdh-oeaw/style-variants";
// eslint-disable-next-line no-restricted-imports
import type { StaticImageData } from "next/image";
import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Image } from "@/components/image";
import { NavLink, type NavLinkProps } from "@/components/nav-link";
import type { Locale } from "@/config/i18n.config";
import { createHref } from "@/lib/create-href";
import logoAcdhCh from "@/public/assets/images/logo-acdh-ch-with-text.svg";
import logoFwf from "@/public/assets/images/logo-fwf.svg";
import logoIhb from "@/public/assets/images/logo-ihb.svg";
import logoOeaw from "@/public/assets/images/logo-oeaw.svg";
import logo from "@/public/assets/images/logo-viecpro-with-text.png";

export function AppFooter(): ReactNode {
	const locale = useLocale();
	const t = useTranslations("AppFooter");

	const links = {
		contact: {
			href: createHref({ pathname: "/documentation/team" }),
			label: t("links.contact"),
		},
		imprint: {
			href: createHref({ pathname: "/imprint" }),
			label: t("links.imprint"),
		},
	} satisfies Record<string, { href: NavLinkProps["href"]; label: string }>;

	// const socialMedia = {} satisfies Record<string, { href: string; label: string; icon: FC }>;

	const acdhLinks = {
		de: {
			href: "https://www.oeaw.ac.at/de/acdh/",
			label: "Austrian Centre for Digital Humanities and Cultural Heritage",
		},
	} satisfies Record<Locale, { href: string; label: string }>;

	const organisations = {
		ihb: {
			href: "https://www.oeaw.ac.at/ihb/home",
			label: "Institut für die Erforschung der Habsburgermonarchie und des Balkanraumes (IHB)",
			image: logoIhb as StaticImageData,
			lang: "de",
			className: "h-8",
		},
		acdhCh: {
			href: "https://www.oeaw.ac.at/de/acdh/acdh-ch-home",
			label: "Austrian Centre for Digital Humanities and Cultural Heritage (ACDH-CH)",
			image: logoAcdhCh as StaticImageData,
			lang: "en",
			className: "h-8",
		},
		oeaw: {
			href: "https://www.oeaw.ac.at/",
			label: "Österreichische Akademie der Wissenschaften",
			image: logoOeaw as StaticImageData,
			lang: "de",
			className: "h-10",
		},
		fwf: {
			href: "https://www.fwf.ac.at/",
			label: "FWF",
			image: logoFwf as StaticImageData,
			lang: "de",
			className: "h-4",
		},
	} satisfies Record<
		string,
		{ href: string; label: string; image: StaticImageData; lang: "de" | "en"; className: string }
	>;

	return (
		<footer className="z-10 grid gap-y-6 border-t border-brand-100 bg-brand-50 py-12">
			<div className="grid gap-y-8 px-8 xs:flex xs:items-center xs:justify-between">
				<Image alt="" className="h-8 w-auto shrink-0 invert" src={logo} />

				{/* <nav aria-label="navigation-social-media">
					<ul className="flex flex-wrap items-center gap-x-6" role="list">
						{Object.entries(socialMedia).map(([id, link]) => {
							const Icon = link.icon;

							return (
								<li key={id} className="shrink-0">
									<NavLink
										className="focus-visible:focus-outline inline-block rounded-0.5"
										href={link.href}
									>
										<Icon className="size-6 text-neutral-400 transition hover:text-brand-600" />
										<span className="sr-only">{link.label}</span>
									</NavLink>
								</li>
							);
						})}
					</ul>
				</nav> */}
			</div>

			<div className="px-8 py-6">
				<ul className="flex flex-wrap items-center gap-x-16 gap-y-8" role="list">
					{Object.entries(organisations).map(([id, link]) => {
						return (
							<li key={id} className="shrink-0">
								<NavLink href={link.href}>
									<Image
										alt=""
										className={cn("w-auto object-contain", link.className)}
										src={link.image}
									/>
									<span className="sr-only" lang={link.lang}>
										{link.label}
									</span>
								</NavLink>
							</li>
						);
					})}
				</ul>
			</div>

			<div className="grid gap-y-8 px-8 text-brand-600">
				<nav aria-label={t("navigation-secondary")}>
					<ul className="flex items-center gap-x-6" role="list">
						{Object.entries(links).map(([id, link]) => {
							return (
								<li key={id}>
									<NavLink
										className="focus-visible:focus-outline rounded-sm hover:underline"
										href={link.href}
									>
										{link.label}
									</NavLink>
								</li>
							);
						})}
					</ul>
				</nav>

				<small className="text-sm">
					&copy; {new Date().getUTCFullYear()}{" "}
					<a
						className="focus-visible:focus-outline rounded-sm hover:underline"
						href={acdhLinks[locale].href}
					>
						{acdhLinks[locale].label}
					</a>
				</small>
			</div>
		</footer>
	);
}
