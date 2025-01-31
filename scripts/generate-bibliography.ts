/**
 * We currently don't fetch zotero collection items at request time,
 * but download the whole collection at build time, because the zotero
 * api is slow as fuck.
 */

import { writeFile } from "node:fs/promises";
import { join } from "node:path";

import { isNonEmptyString, log } from "@acdh-oeaw/lib";

import { getZoteroItems } from "@/app/(app)/documentation/bibliography/_lib/zotero";

async function generate() {
	const items = await getZoteroItems();

	const bibliography = items.data.map((item) => {
		const { key, shortTitle, title, url } = item.data;
		/**
		 * Zotero collection has full citation info in the `shortTitle` field.
		 * However, a few entries don't have a `shortTitle`.
		 */
		return { key, citation: shortTitle || title, url: isNonEmptyString(url.trim()) ? url : null };
	});

	bibliography.sort((a, z) => {
		return a.citation.localeCompare(z.citation);
	});

	await writeFile(
		join(process.cwd(), "public", "bibliography.json"),
		JSON.stringify(bibliography),
		{ encoding: "utf-8" },
	);
}

generate()
	.then(() => {
		log.success("Successfully generated bibliography.");
	})
	.catch((error: unknown) => {
		log.error("Failed to generate bibliography.\n", String(error));
		console.error(error);
	});
