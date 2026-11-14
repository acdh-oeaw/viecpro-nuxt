import "#/styles/index.css";

import { pick } from "@acdh-oeaw/lib";
import { cn } from "@acdh-oeaw/style-variants";
import type { Metadata, ResolvingMetadata, Viewport } from "next";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { LocalizedStringProvider as Translations } from "react-aria-components/i18n";
import { jsonLdScriptProps } from "react-schemaorg";

import { AppFooter } from "#/app/(app)/_components/app-footer.tsx";
import { AppHeader } from "#/app/(app)/_components/app-header.tsx";
import { AppLayout } from "#/app/(app)/_components/app-layout.tsx";
import { Providers } from "#/app/(app)/_components/providers.tsx";
import { TailwindIndicator } from "#/app/(app)/_components/tailwind-indicator.tsx";
import { id } from "#/components/main-content.tsx";
import { SkipLink } from "#/components/skip-link.tsx";
import { env } from "#/config/env.config.ts";
import { AnalyticsScript } from "#/lib/analytics-script.tsx";
import * as fonts from "#/lib/fonts.ts";

interface LocaleLayoutProps {
	children: ReactNode;
}

export const viewport: Viewport = {
	colorScheme: "light",
	initialScale: 1,
	width: "device-width",
};

export async function generateMetadata(
	// eslint-disable-next-line @typescript-eslint/no-generated-empty-object-type
	_props: Omit<Readonly<LocaleLayoutProps>, "children">,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const locale = await getLocale();
	const meta = await getTranslations("metadata");

	const metadata: Metadata = {
		metadataBase: new URL(env.NEXT_PUBLIC_APP_BASE_URL),
		alternates: {
			canonical: "./",
		},
		title: {
			default: meta("title"),
			template: ["%s", meta("title")].join(" | "),
		},
		description: meta("description"),
		openGraph: {
			title: meta("title"),
			description: meta("description"),
			url: "./",
			siteName: meta("title"),
			locale,
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			creator: meta("twitter.creator"),
			site: meta("twitter.site"),
		},
		verification: {
			google: env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
		},
	};

	return metadata;
}

export default async function LocaleLayout(props: Readonly<LocaleLayoutProps>): Promise<ReactNode> {
	const { children } = props;

	const locale = await getLocale();
	const t = await getTranslations("LocaleLayout");
	const meta = await getTranslations("metadata");
	const messages = await getMessages();
	const errorPageMessages = pick(messages, ["Error"]);

	return (
		<html className={cn(fonts.body.variable, fonts.heading.variable, "antialiased")} lang={locale}>
			<body>
				{/* @see https://nextjs.org/docs/app/building-your-application/optimizing/metadata#json-ld */}
				<script
					{...jsonLdScriptProps({
						"@context": "https://schema.org",
						"@type": "WebSite",
						name: meta("title"),
						description: meta("description"),
					})}
				/>

				{/**
				 * @see https://react-spectrum.adobe.com/react-aria/ssr.html#optimizing-bundle-size
				 *
				 * TODO: only include translations for components actually used
				 *
				 * @see https://react-spectrum.adobe.com/react-aria/ssr.html#advanced-optimization
				 */}
				<Translations locale={locale} />

				<Providers locale={locale} messages={errorPageMessages}>
					<AnalyticsScript
						baseUrl={env.NEXT_PUBLIC_MATOMO_BASE_URL}
						id={env.NEXT_PUBLIC_MATOMO_ID}
					/>

					<SkipLink targetId={id}>{t("skip-to-main-content")}</SkipLink>

					<AppLayout>
						<AppHeader />
						{children}
						<AppFooter />
					</AppLayout>
				</Providers>

				<TailwindIndicator />
			</body>
		</html>
	);
}
