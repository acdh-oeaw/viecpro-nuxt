import type { Locale } from "#/config/i18n.config.ts";

declare module "@acdh-oeaw/keystatic-lib" {
	export interface KeystaticConfig {
		locales: Locale;
	}
}
