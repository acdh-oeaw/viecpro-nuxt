import type { LocaleObject } from "vue-i18n-routing";

import type de from "@/locales/de.json";
import type en from "@/locales/en.json";

export const locales = {
	de: { code: "de", iso: "de-AT", file: "de.json" },
	en: { code: "en", iso: "en-GB", file: "en.json" },
} satisfies Record<string, LocaleObject>;

export type Locale = keyof typeof locales;

export const defaultLocale: Locale = "en";

export type Messages = typeof en;

export interface Schema {
	message: Messages;
}

export function isValidLocale(value: string): value is Locale {
	return value in locales;
}

export interface Translations extends Record<Locale, Messages> {
	de: typeof de;
	en: typeof en;
}
