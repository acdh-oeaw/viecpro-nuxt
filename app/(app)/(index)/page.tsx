import { ArrowRightIcon } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { LinkButton } from "@/components/content/link-button";
import { Image } from "@/components/image";
import { MainContent } from "@/components/main-content";
import { createSingletonResource } from "@/lib/keystatic/resources";
import hero from "@/public/assets/images/hero.jpg";

interface IndexPageProps extends EmptyObject {}

export async function generateMetadata(
	_props: Readonly<IndexPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const _t = await getTranslations("IndexPage");

	const metadata: Metadata = {
		/**
		 * Fall back to `title.default` from `layout.tsx`.
		 *
		 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata#title
		 */
		// title: undefined,
	};

	return metadata;
}

export default async function IndexPage(_props: Readonly<IndexPageProps>): Promise<ReactNode> {
	const locale = await getLocale();

	const page = await createSingletonResource("index-page", locale).read();
	const { content, sections, subtitle, title } = page.data;
	const { default: Content } = await page.compile(content);

	return (
		<MainContent className="flex flex-col">
			<div className="border-b-8 border-t-4 border-brand-900">
				<Image
					alt=""
					className="aspect-video max-h-[480px] min-h-[320px] w-full object-cover"
					decoding="sync"
					priority={true}
					sizes="100vw"
					src={hero}
				/>
			</div>

			<div className="mx-auto grid w-full max-w-4xl gap-y-12 px-4 py-16 xs:px-8 xs:py-24">
				<div>
					<h1 className="border-b-2 border-brand-100 pb-6 text-4xl text-brand-600 xs:text-5xl md:text-6xl">
						<span className="font-black">{title}</span>
						<span className="font-black">. </span>
						<br />
						<span className="text-3xl font-extralight xs:text-4xl sm:text-5xl md:text-6xl">
							{subtitle}
						</span>
					</h1>
				</div>

				<section className="prose max-w-none">
					<Content />
				</section>

				{sections.map(async (section, index) => {
					const { content, title, links } = section;

					const { default: Content } = await page.compile(content);

					return (
						<section key={index} className="prose max-w-none">
							<h2 className="border-b border-brand-100 text-2xl font-bold text-brand-600">
								{title}
							</h2>
							<Content />
							<div>
								{links.map((link, index) => {
									return (
										<LinkButton key={index} link={{ discriminant: "external", value: link.href }}>
											{link.label}
											<ArrowRightIcon aria-hidden={true} className="size-4 shrink-0" />
										</LinkButton>
									);
								})}
							</div>
						</section>
					);
				})}
			</div>
		</MainContent>
	);
}
