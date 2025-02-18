import { createUrl, createUrlSearchParams, log, request } from "@acdh-oeaw/lib";

import { zoteroGroupId } from "@/config/zotero.config";
import { parseLinkHeader } from "@/lib/parse-link-header";

const baseUrl = "https://api.zotero.org";
const headers = { "Zotero-API-Version": "3" };

interface ZoteroItem {
	data: {
		key: string;
		shortTitle: string;
		tags: Array<{ tag: string }>;
		title: string;
		url: string | null;
	};
}

export async function getZoteroItems() {
	let url: URL | string | undefined = createUrl({
		baseUrl,
		pathname: `/groups/${String(zoteroGroupId)}/items`,
		searchParams: createUrlSearchParams({
			itemType: "-attachment",
			limit: 25,
			sort: "title",
		}),
	});

	let page = 1;
	let total: number;
	const data: Array<ZoteroItem> = [];

	do {
		log.info(`Fetching page ${String(page)}`);

		const response = await request(url, {
			headers,
			responseType: "raw",
		});

		data.push(...((await response.json()) as Array<ZoteroItem>));

		/**
		 * Zotero returns pagination information in link header.
		 *
		 * @see https://www.zotero.org/support/dev/web_api/v3/basics?parameters_for_format_bib_includecontent_bib_includecontent_citation#sorting_and_pagination
		 */
		const links = parseLinkHeader(response.headers.get("link"));

		url = "next" in links ? links.next : undefined;

		total = Number(response.headers.get("total-results"));
		page++;
	} while (url != null);

	return {
		data,
		total,
	};
}
