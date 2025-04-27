import { HttpError, request } from "@acdh-oeaw/lib";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { MainContent } from "@/components/main-content";
import type { Locale } from "@/config/i18n.config";
import { createImprintUrl } from "@/config/imprint.config";

interface ImprintPageProps extends EmptyObject {}

export async function generateMetadata(
	_props: Readonly<ImprintPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const t = await getTranslations("ImprintPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function ImprintPage(_props: Readonly<ImprintPageProps>): Promise<ReactNode> {
	const locale = await getLocale();
	const t = await getTranslations("ImprintPage");

	const html = await getImprintHtml(locale);

	return (
		<MainContent className="flex flex-col">
			<section className="border-b border-brand-100 bg-brand-50 py-16 xs:py-20">
				<div className="mx-auto grid w-full max-w-7xl gap-y-4 px-4 xs:px-8">
					<h1 className="font-heading text-3xl font-bold text-balance text-brand-600 xs:text-4xl md:text-5xl">
						{t("title")}
					</h1>
				</div>
			</section>

			<div className="mx-auto w-full max-w-7xl px-4 xs:px-8">
				<section
					dangerouslySetInnerHTML={{ __html: html }}
					className="prose w-full max-w-4xl py-16 xs:py-20"
				/>
			</div>
		</MainContent>
	);
}

async function getImprintHtml(locale: Locale): Promise<string> {
	try {
		const url = createImprintUrl(locale);
		const html = await request(url, { responseType: "text" });

		return html;
	} catch (error) {
		if (error instanceof HttpError && error.response.status === 404) {
			notFound();
		}

		throw error;
	}
}
