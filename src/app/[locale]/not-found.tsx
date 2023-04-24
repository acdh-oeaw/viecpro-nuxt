import { type Metadata, type ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";

import { MainContent } from "@/components/main-content";
import { type Locale } from "~/config/i18n.config";

interface Props {
	params: {
		locale: Locale;
	};
}

export async function generateMetadata(
	_props: Props,
	_parent?: ResolvingMetadata,
): Promise<Metadata> {
	const t = await getTranslations("NotFoundPage");

	const metadata: Metadata = {
		title: t("meta.title"),
		robots: {
			follow: false,
			index: false,
		},
	};

	return metadata;
}

export default async function NotFoundPage(_props: Props): Promise<JSX.Element> {
	const t = await getTranslations("NotFoundPage");

	return (
		<MainContent>
			<h1>{t("title")}</h1>
		</MainContent>
	);
}
