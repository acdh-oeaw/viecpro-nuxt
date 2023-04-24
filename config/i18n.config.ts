import { type Writable } from "ts-essentials";

const _locales = ["de", "en"] as const;
export const locales = _locales as Writable<typeof _locales>;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "de";
