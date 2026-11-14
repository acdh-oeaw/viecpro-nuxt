import { defineConfig } from "oxlint";

/**
 * Rule options are _not_ merged through `extends` - the entry config's value for a rule replaces any inherited one, so
 * a `no-restricted-imports` declared here would silently drop the restrictions declared in `oxlint.config.ts`. Exported
 * instead, the same way `settings` is, so `oxlint.config.ts` can compose them.
 */
export const restrictedImports = {
	paths: [
		{
			message: "Please use `next/navigation` instead.",
			name: "next/router",
		},
	],
	patterns: [
		{
			group: ["next/dist/**"],
			message: "Please use a public entrypoint instead of reaching into next.js internals.",
		},
	],
};

const config = defineConfig({
	plugins: ["nextjs"],
	rules: {
		/**
		 * ================================================================================================================
		 * Correctness.
		 * ================================================================================================================
		 */

		"nextjs/google-font-display": "off",
		"nextjs/google-font-preconnect": "off",
		"nextjs/inline-script-id": "error",
		"nextjs/next-script-for-ga": "off",
		"nextjs/no-assign-module-variable": "off",
		"nextjs/no-async-client-component": "error",
		"nextjs/no-before-interactive-script-outside-document": "off",
		"nextjs/no-css-tags": "error",
		"nextjs/no-document-import-in-page": "off",
		"nextjs/no-duplicate-head": "off",
		"nextjs/no-head-element": "off",
		"nextjs/no-head-import-in-document": "off",
		"nextjs/no-html-link-for-pages": "error",
		"nextjs/no-img-element": "warn",
		"nextjs/no-page-custom-font": "off",
		"nextjs/no-script-component-in-head": "off",
		"nextjs/no-styled-jsx-in-document": "off",
		"nextjs/no-sync-scripts": "warn",
		"nextjs/no-title-in-document-head": "off",
		"nextjs/no-typos": "off",
		"nextjs/no-unwanted-polyfillio": "off",
	},
	overrides: [
		{
			files: [
				"next.config.ts",
				"app/**/default.tsx",
				"app/**/error.tsx",
				"app/**/forbidden.tsx",
				"app/**/global-error.tsx",
				"app/**/global-not-found.tsx",
				"app/**/not-found.tsx",
				"app/**/layout.tsx",
				"app/**/loading.tsx",
				"app/**/opengraph-image.tsx",
				"app/**/page.tsx",
				"app/**/unauthorized.tsx",
				"app/manifest.ts",
				"app/robots.ts",
				"app/sitemap.ts",
				"playwright.config.ts",
			],
			rules: {
				"import/no-default-export": "off",
			},
		},
	],
});

export default config;
