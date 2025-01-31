import type { Formats } from "next-intl";

import type metadataDe from "@/content/de/metadata/index.json";
import type de from "@/messages/de.json";

export const locales = ["de"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "de";

export type IntlMessages = typeof de & { metadata: typeof metadataDe };

export interface IntlTranslations extends Record<Locale, IntlMessages> {
	de: typeof de & { metadata: typeof metadataDe };
}

export const formats = {
	dateTime: {
		long: {
			dateStyle: "long",
		},
	},
	list: {
		enumeration: {
			style: "long",
			type: "conjunction",
		},
	},
} satisfies Formats;

export type IntlFormats = typeof formats;
