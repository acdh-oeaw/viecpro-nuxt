import type { LocaleObject } from "vue-i18n-routing";

import type de from "@/locales/de.json";

export const locales = {
	de: { code: "de", language: "de-AT", file: "de.json" },
} satisfies Record<string, LocaleObject>;

export type Locale = keyof typeof locales;

export const defaultLocale: Locale = "de";

export type Messages = typeof de;

export interface Schema {
	message: Messages;
}

export function isValidLocale(value: string): value is Locale {
	return value in locales;
}

export interface Translations extends Record<Locale, Messages> {
	de: typeof de;
}
