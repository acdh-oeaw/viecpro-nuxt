import { withI18nPrefix } from "@acdh-oeaw/keystatic-lib";
import { config } from "@keystatic/core";

import { Logo } from "#/components/logo.tsx";
import { env } from "#/config/env.config.ts";
import { locales } from "#/config/i18n.config.ts";
import { createDocumentation } from "#/lib/keystatic/collections.tsx";
import {
	createDocumentationNav,
	createIndexPage,
	createMetadata,
} from "#/lib/keystatic/singletons.tsx";

export default config({
	collections: {
		[withI18nPrefix("documentation", "de")]: createDocumentation("de"),
	},
	singletons: {
		[withI18nPrefix("index-page", "de")]: createIndexPage("de"),
		[withI18nPrefix("documentation-nav", "de")]: createDocumentationNav("de"),
		[withI18nPrefix("metadata", "de")]: createMetadata("de"),
	},
	storage:
		env.NEXT_PUBLIC_KEYSTATIC_MODE === "github" &&
		env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER &&
		env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME
			? {
					kind: "github",
					repo: {
						owner: env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER,
						name: env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME,
					},
					branchPrefix: "content/",
				}
			: {
					kind: "local",
				},
	ui: {
		brand: {
			mark() {
				return <Logo />;
			},
			name: "ACDH",
		},
		navigation: {
			Pages: locales.map((locale) => {
				return withI18nPrefix("index-page", locale);
			}),
			Documentation: [
				...locales.map((locale) => {
					return withI18nPrefix("documentation", locale);
				}),
				...locales.map((locale) => {
					return withI18nPrefix("documentation-nav", locale);
				}),
			],
			Metadata: locales.map((locale) => {
				return withI18nPrefix("metadata", locale);
			}),
		},
	},
});
