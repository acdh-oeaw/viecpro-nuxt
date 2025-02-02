import type { Metadata, ResolvingMetadata } from "next";
import { getLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { DocumentationNavigation } from "@/app/(app)/documentation/_components/documentation-navigation";
import { MainContent } from "@/components/main-content";
import { createCollectionResource } from "@/lib/keystatic/resources";

interface DocumentationPageProps {
	params: Promise<{
		id: string;
	}>;
}

export const dynamicParams = false;

export async function generateStaticParams(): Promise<
	Array<Pick<Awaited<DocumentationPageProps["params"]>, "id">>
> {
	const locale = await getLocale();

	const ids = await createCollectionResource("documentation", locale).list();

	return ids.map((id) => {
		return { id };
	});
}

export async function generateMetadata(
	props: Readonly<DocumentationPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const locale = await getLocale();

	const { id: _id } = await params;
	const id = decodeURIComponent(_id);

	const entry = await createCollectionResource("documentation", locale).read(id);
	const { title } = entry.data;

	const metadata: Metadata = {
		title,
	};

	return metadata;
}

export default async function DocumentationPage(
	props: Readonly<DocumentationPageProps>,
): Promise<ReactNode> {
	const { params } = props;

	const locale = await getLocale();

	const { id: _id } = await params;
	const id = decodeURIComponent(_id);

	const entry = await createCollectionResource("documentation", locale).read(id);
	const { content, lead, title } = entry.data;
	const { default: Content } = await entry.compile(content);

	return (
		<MainContent className="flex flex-col">
			<section className="border-b border-brand-100 bg-brand-50 py-16 xs:py-20">
				<div className="mx-auto grid w-full max-w-7xl gap-y-4 px-4 xs:px-8">
					<h1 className="text-balance font-heading text-3xl font-bold text-brand-600 xs:text-4xl md:text-5xl">
						{title}
					</h1>
					{lead ? <p className="font-heading text-brand-500 xl:text-lg">{lead}</p> : null}
				</div>
			</section>

			<div className="mx-auto grid w-full max-w-7xl gap-x-4 lg:flex">
				<aside className="border-b border-brand-100 bg-brand-50 p-8 lg:hidden">
					<DocumentationNavigation />
				</aside>

				<div className="w-full max-w-3xl px-4 xs:px-8">
					<section className="prose max-w-none py-16 xs:py-20">
						<Content />
					</section>
				</div>

				<aside className="hidden px-4 py-16 xs:px-8 xs:py-20 lg:block">
					<DocumentationNavigation />
				</aside>
			</div>
		</MainContent>
	);
}
