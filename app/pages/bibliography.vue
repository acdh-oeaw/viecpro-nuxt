<script lang="ts" setup>
import { createUrl, createUrlSearchParams } from "@acdh-oeaw/lib";
import { useQuery } from "@tanstack/vue-query";
import { Loader2Icon } from "lucide-vue-next";

import { groupId } from "@/config/zotero.config";

defineRouteRules({
	prerender: true,
});

const t = useTranslations();

usePageMetadata({
	title: t("pages.documentation.title"),
});

interface ZoteroItem {
	key: string;
	version: number;
	// library: {}
	// links: {}
	// meta: {}
	bib: string;
}

const baseUrl = "https://api.zotero.org";
const headers = { "Zotero-API-Version": "3" };

function createZoteroUrl(page = 1, limit = 25) {
	const offset = (page - 1) * limit;

	return createUrl({
		baseUrl,
		pathname: `/groups/${String(groupId)}/items`,
		searchParams: createUrlSearchParams({
			// format: "bib",
			itemType: "-attachment",
			/** @see https://www.zotero.org/support/dev/web_api/v3/basics?parameters_for_format_bib_includecontent_bib_includecontent_citation */
			include: "bib",
			limit,
			linkwrap: 1,
			// sort: https://www.zotero.org/support/dev/web_api/v3/basics#sorting_and_pagination
			start: offset,
			style: "apa",
		}),
	});
}

async function getZoteroItemsPage(page = 1, limit = 25) {
	const url = createZoteroUrl(page, limit);
	const response = await fetch(url, { headers });
	const data = (await response.json()) as Array<ZoteroItem>;

	const count = Number(response.headers.get("total-results") ?? 0);
	const pages = Math.ceil(count / limit);

	return { items: data, count, page, pages };
}

async function getAllZoteroItems(limit = 25) {
	const results: Array<ZoteroItem> = [];

	let page = 1;

	const { items, count, pages } = await getZoteroItemsPage(page, limit);
	results.push(...items);

	while (++page <= pages) {
		const { items } = await getZoteroItemsPage(page, limit);
		results.push(...items);
	}

	return { items: results, count, pages };
}

const { data } = useQuery({
	queryKey: ["zotero-items"] as const,
	queryFn() {
		// FIXME: THIS IS DEAD SLOW!
		// return getAllZoteroItems();
		return getZoteroItemsPage();
	},
});
</script>

<template>
	<MainContent class="mx-auto w-full max-w-container p-2">
		<div class="prose prose-sm md:prose-base">
			<h1>{{ t("BibliographyPage.title") }}</h1>

			<div v-if="data != null">
				<div>Page {{ data.page }} of {{ data.pages }}</div>
				<ul role="list">
					<li v-for="item of data.items" :key="item.key" v-html="item.bib"></li>
				</ul>
				<nav aria-label="Pagination"></nav>
			</div>

			<div v-else>
				<Centered>
					<Loader2Icon class="size-8 animate-spin" />
				</Centered>
			</div>
		</div>
	</MainContent>
</template>
