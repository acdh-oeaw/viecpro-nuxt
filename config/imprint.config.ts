import { createUrl, createUrlSearchParams } from "@acdh-oeaw/lib";

import type { Locale } from "@/config/i18n.config";
import { useRuntimeConfig } from "#app";

const baseUrl = "https://shared.acdh.oeaw.ac.at";
const pathname = "/acdh-common-assets/api/imprint.php";

export function createImprintUrl(locale: Locale): URL {
	const env = useRuntimeConfig();

	const redmineId = env.public.NUXT_PUBLIC_APP_BASE_URL;

	return createUrl({
		baseUrl,
		pathname,
		searchParams: createUrlSearchParams({
			outputLang: locale,
			serviceID: redmineId,
		}),
	});
}
