import { createUrl } from "@stefanprobst/request";

import { useRuntimeConfig } from "#app";
import { type Locale } from "~/config/i18n.config";

const baseUrl = "https://shared.acdh.oeaw.ac.at";
const pathname = "/acdh-common-assets/api/imprint.php";

export function createImprintUrl(locale: Locale): URL {
	const env = useRuntimeConfig();

	const redmineId = env.public.NUXT_PUBLIC_APP_BASE_URL;

	return createUrl({
		baseUrl,
		pathname,
		searchParams: {
			outputLang: locale,
			serviceID: redmineId,
		},
	});
}
