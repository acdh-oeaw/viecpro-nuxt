import type { Metadata, ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { DocumentationNavigation } from "@/app/(app)/documentation/_components/documentation-navigation";
import { MainContent } from "@/components/main-content";
import bibliography from "@/public/bibliography.json";

interface BibliographyPageProps extends EmptyObject {}

export async function generateMetadata(
	_props: Readonly<BibliographyPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const t = await getTranslations("BibliographyPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function BibliographyPage(
	_props: Readonly<BibliographyPageProps>,
): Promise<ReactNode> {
	const t = await getTranslations("BibliographyPage");

	return (
		<MainContent className="flex flex-col">
			<section className="border-b border-brand-100 bg-brand-50 py-16 xs:py-20">
				<div className="mx-auto grid w-full max-w-7xl gap-y-4 px-4 xs:px-8">
					<h1 className="text-balance font-heading text-3xl font-bold text-brand-600 xs:text-4xl md:text-5xl">
						{t("title")}
					</h1>
				</div>
			</section>

			<div className="mx-auto grid w-full max-w-7xl gap-x-4 lg:flex">
				<aside className="border-b border-brand-100 bg-brand-50 p-8 lg:hidden">
					<DocumentationNavigation />
				</aside>

				<div className="w-full max-w-3xl px-4 xs:px-8">
					<section className="prose py-16 xs:py-20">
						<ul role="list">
							{bibliography.map((item) => {
								return (
									<li key={item.key}>
										<div>{item.citation}</div>
										{item.url ? <a href={item.url}>{item.url}</a> : null}
									</li>
								);
							})}
						</ul>
					</section>
				</div>

				<aside className="hidden px-4 py-16 xs:px-8 xs:py-20 lg:block">
					<DocumentationNavigation />
				</aside>
			</div>
		</MainContent>
	);
}
