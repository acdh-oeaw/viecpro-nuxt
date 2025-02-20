import { join } from "node:path";

import { createUrl } from "@acdh-oeaw/lib";
import { glob } from "fast-glob";
import type { MetadataRoute } from "next";

import { env } from "@/config/env.config";
import { client } from "@/lib/typesense/client";

const baseUrl = env.NEXT_PUBLIC_APP_BASE_URL;

/**
 * Google supports up to 50.000 entries per sitemap file. Apps which need more than that can use
 * `generateSitemaps` to generate multiple sitemap files.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap#generating-a-sitemap-using-code-js-ts
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const paths = await glob("./**/page.tsx", { cwd: join(process.cwd(), "app", "(app)") });

	const routes: Array<string> = [];

	paths.forEach((path) => {
		const route = path.slice(0, -"/page.tsx".length);

		if (route === "[...notfound]") return;

		const segments = [];

		for (const segment of route.split("/")) {
			/** Dynamic routes. */
			if (segment.startsWith("[") && segment.endsWith("]")) return;

			/** Route groups. */
			if (segment.startsWith("(") && segment.endsWith(")")) continue;

			segments.push(segment);
		}

		routes.push(segments.join("/"));
	});

	const courts = await client
		.collections([env.NEXT_PUBLIC_TYPESENSE_COLLECTION_PREFIX, "court"].join(""))
		.documents()
		.export({ include_fields: "id" });

	for (const line of courts.split("\n")) {
		if (line === "") continue;
		const entry = JSON.parse(line) as { id: string };
		routes.push(`/courts/${entry.id}`);
	}

	const institutions = await client
		.collections([env.NEXT_PUBLIC_TYPESENSE_COLLECTION_PREFIX, "institution"].join(""))
		.documents()
		.export({ include_fields: "id" });

	for (const line of institutions.split("\n")) {
		if (line === "") continue;
		const entry = JSON.parse(line) as { id: string };
		routes.push(`/institutions/${entry.id}`);
	}

	const persons = await client
		.collections([env.NEXT_PUBLIC_TYPESENSE_COLLECTION_PREFIX, "person"].join(""))
		.documents()
		.export({ include_fields: "id" });

	for (const line of persons.split("\n")) {
		if (line === "") continue;
		const entry = JSON.parse(line) as { id: string };
		routes.push(`/persons/${entry.id}`);
	}

	const places = await client
		.collections([env.NEXT_PUBLIC_TYPESENSE_COLLECTION_PREFIX, "place"].join(""))
		.documents()
		.export({ include_fields: "id" });

	for (const line of places.split("\n")) {
		if (line === "") continue;
		const entry = JSON.parse(line) as { id: string };
		routes.push(`/places/${entry.id}`);
	}

	const entries = routes.map((pathname) => {
		return {
			url: String(createUrl({ baseUrl, pathname })),
			/**
			 * Only add `lastmod` when the publication date is actually known.
			 * Don't use the build date instead.
			 */
			// lastModified: new Date(),
		};
	});

	return entries;
}
