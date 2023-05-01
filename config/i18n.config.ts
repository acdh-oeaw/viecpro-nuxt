import type messages from "@/locales/de.json";

export type LocaleObject = {
	code: string;
	iso: string;
	name: string;
	file: string;
};

// GP:  shouldn't this just be an array of LocaleObjects? see: https://i18n.nuxtjs.org/api#locales (section locales)
export const locales: Record<"de" | "en", LocaleObject> = {
	de: { code: "de", iso: "de-AT", name: "Deutsch", file: "de.json" },
	en: { code: "en", iso: "en-US", name: "English", file: "en.json" },
};

export type Locale = keyof typeof locales;
export type Locales = typeof locales.de;
export const defaultLocale: Locale = "de";

export type Messages = typeof messages;

export type Schema = { message: Messages };
