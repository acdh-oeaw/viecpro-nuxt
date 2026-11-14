import "server-only";

import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

import type { Locale } from "#/config/i18n.config.ts";
import { compileMdx } from "#/lib/compile-mdx.ts";

interface DocumentationFrontmatter extends Record<string, unknown> {
	title: string;
	lead?: string;
}

export async function listDocumentationPages(locale: Locale): Promise<Array<string>> {
	const directory = join(process.cwd(), "content", locale, "documentation");
	const entries = await readdir(directory, { withFileTypes: true });

	return entries
		.filter((entry) => {
			return entry.isDirectory();
		})
		.map((entry) => {
			return entry.name;
		});
}

export async function readDocumentationPage(locale: Locale, id: string) {
	if (!(await listDocumentationPages(locale)).includes(id)) {
		throw new Error(`Unknown documentation page: ${id}`);
	}

	const path = join(process.cwd(), "content", locale, "documentation", id, "index.mdx");
	const content = await readFile(path, "utf-8");
	const module = await compileMdx<DocumentationFrontmatter>(content, locale, pathToFileURL(path));

	return { ...module.frontmatter, Content: module.default };
}

export async function readIndexPage(locale: Locale) {
	const path = join(process.cwd(), "content", locale, "index-page", "index.json");
	const data = JSON.parse(await readFile(path, "utf-8")) as {
		title: string;
		subtitle: string;
		content: string;
		sections: Array<{
			title: string;
			content: string;
			links: Array<{ label: string; href: string }>;
		}>;
	};
	const baseUrl = pathToFileURL(path);

	return {
		...data,
		compile(content: string) {
			return compileMdx(content, locale, baseUrl);
		},
	};
}

export async function readDocumentationNavigation(locale: Locale) {
	const path = join(process.cwd(), "content", locale, "documentation-nav", "index.json");
	return JSON.parse(await readFile(path, "utf-8")) as {
		links: Array<{ label: string; id: string }>;
	};
}
