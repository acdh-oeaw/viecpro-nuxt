import { type Metadata, type ResolvingMetadata } from "next";
import { useTranslations } from "next-intl";
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
	const _t = await getTranslations("IndexPage");

	const metadata: Metadata = {
		/**
		 * Fall back to `title.default` from `layout.tsx`.
		 *
		 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata#title
		 */
		// title: undefined,
		/** Inherit root layout description. */
		// description: t("meta.description"),
		alternates: {
			canonical: "/",
		},
	};

	return metadata;
}

export default function IndexPage(_props: Props): JSX.Element {
	const t = useTranslations("IndexPage");

	return (
		<MainContent>
			<h1>{t("title")}</h1>
		</MainContent>
	);
}
