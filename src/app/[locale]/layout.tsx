import "tailwindcss/tailwind.css";
import "@stefanprobst/css-reset/reset.css";

import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { type ReactNode } from "react";
import { JsonLd } from "react-schemaorg";
import { type WebSite, type WithContext } from "schema-dts";

import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { id } from "@/components/main-content";
import { SkipLink } from "@/components/skip-link";
import { cn } from "@/lib/cn";
import * as fonts from "@/lib/fonts";
import { env } from "~/config/env.config";
import { type Locale } from "~/config/i18n.config";

async function createJsonLd() {
	const t = await getTranslations("RootLayout");

	const jsonLd: WithContext<WebSite> = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: t("meta.title"),
		description: t("meta.description"),
	};

	return jsonLd;
}

interface Props {
	children: ReactNode;
	params: {
		locale: Locale;
	};
}

export async function generateMetadata(_props: Props): Promise<Metadata> {
	const locale = getLocale();
	const t = await getTranslations("RootLayout");

	const metadata: Metadata = {
		title: {
			default: t("meta.title"),
			template: ["%s", t("meta.title")].join(" | "),
		},
		description: t("meta.description"),
		colorScheme: "light dark",
		metadataBase: new URL(env.NEXT_PUBLIC_APP_BASE_URL),
		openGraph: {
			title: t("meta.title"),
			description: t("meta.description"),
			url: env.NEXT_PUBLIC_APP_BASE_URL,
			siteName: t("meta.title"),
			locale,
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			creator: "@acdh_oeaw",
		},
		verification: {
			// google: "",
		},
	};

	return metadata;
}

export default async function RootLayout(props: Props): Promise<JSX.Element> {
	const { children, params } = props;

	const locale = useLocale();
	const t = useTranslations("RootLayout");

	if (params.locale !== locale) {
		notFound();
	}

	const jsonLd = await createJsonLd();

	return (
		<html
			className={cn(fonts.body.variable, "bg-neutral-50 font-body text-neutral-900")}
			lang={locale}
		>
			<body>
				<JsonLd item={jsonLd} />

				<SkipLink targetId={id}>{t("skip-to-main-content")}</SkipLink>

				<div className="grid min-h-screen grid-rows-[auto_1fr_auto]">
					<AppHeader />
					{children}
					<AppFooter />
				</div>
			</body>
		</html>
	);
}
