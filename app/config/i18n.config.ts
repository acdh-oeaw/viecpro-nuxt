import type { LocaleObject } from "vue-i18n-routing";

import type de from "~/i18n/messages/de.json";

export const locales = ["de"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "de";

export const localesMap = {
	de: { code: "de", language: "de", file: "de.json" },
} satisfies Record<Locale, LocaleObject>;

export type Messages = typeof de;

export interface Schema {
	message: Messages;
}

export function isValidLocale(value: string): value is Locale {
	return value in localesMap;
}

export interface Translations extends Record<Locale, Messages> {
	de: typeof de;
}
