import { useI18n as useInternationalisation } from "#imports";
import { type Locale, type Schema } from "~/config/i18n.config";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useI18n() {
	return useInternationalisation<Schema, Locale>();
}
