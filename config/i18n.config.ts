import { type LocaleObject } from "vue-i18n-routing";

import type messages from "@/locales/de.json";

export const locales = {
	de: { code: "de", iso: "de-AT", name: "Deutsch", file: "de.json" },
	en: { code: "en", iso: "en-US", name: "English", file: "en.json" },
} satisfies Record<string, LocaleObject>;

export type Locale = keyof typeof locales;

export const defaultLocale: Locale = "de";

export type Messages = typeof messages;

export type Schema = { message: Messages };
