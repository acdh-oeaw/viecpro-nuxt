import { withI18nPrefix } from "@acdh-oeaw/keystatic-lib";
import { config } from "@keystatic/core";

import { Logo } from "@/components/logo";
import { env } from "@/config/env.config";
import { locales } from "@/config/i18n.config";
import { createDocumentation } from "@/lib/keystatic/collections";
import {
	createDocumentationNav,
	createIndexPage,
	createMetadata,
} from "@/lib/keystatic/singletons";

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
			name: "ACDH-CH",
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
