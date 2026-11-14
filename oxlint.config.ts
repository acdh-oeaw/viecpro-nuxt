import * as path from "node:path";

import { defineConfig } from "oxlint";

import base from "#/config/oxlint/base.ts";
import nextjs, { restrictedImports as nextjsRestrictedImports } from "#/config/oxlint/nextjs.ts";
import playwright from "#/config/oxlint/playwright.ts";
import react, { settings as reactSettings } from "#/config/oxlint/react.ts";
import regexp from "#/config/oxlint/regexp.ts";
import tailwindcss, { settings as betterTailwindcssSettings } from "#/config/oxlint/tailwindcss.ts";

/**
 * Rule options are _not_ inherited through `extends` - the entry config's value for a rule replaces any inherited one -
 * so the shared configs export their restrictions instead of declaring them, and they are composed here.
 */
const restrictedImports = {
	paths: [
		{
			message: "Please use `#/components/image` or `#/components/server-image` instead.",
			name: "next/image",
		},
		{
			message: "Please use `#/components/link` instead.",
			name: "next/link",
		},
		{
			importNames: ["redirect", "permanentRedirect", "useRouter", "usePathname"],
			message: "Please use `#/lib/i18n/navigation` instead.",
			name: "next/navigation",
		},
		{
			message: "Please use `#/lib/i18n/navigation` instead.",
			name: "next/router",
		},
	],
	patterns: [
		...nextjsRestrictedImports.patterns,
		{
			/**
			 * Require explicit file extensions for internal modules, so they can be resolved natively by node.js.
			 */
			regex: String.raw`^(?:#|\.{1,2})/(?!.*\.(?:avif|css|gif|jpe?g|js|json|mdx?|mjs|png|svg|tsx?|webp)$)`,
			message: "Please add the file extension to internal imports.",
		},
	],
};

const config = defineConfig({
	/**
	 * Every rule is configured explicitly, so no rule may be enabled by the category it happens to belong to. Categories
	 * are not inherited through `extends` either - the entry config's value is used verbatim - so turning them off here
	 * also turns off the ones the shared configs declare.
	 */
	categories: {
		correctness: "off",
		nursery: "off",
		pedantic: "off",
		perf: "off",
		restriction: "off",
		style: "off",
		suspicious: "off",
	},
	extends: [base, nextjs, playwright, react, regexp, tailwindcss],
	/** `env` is not inherited through `extends`, so it has to be declared here to have any effect. */
	env: {
		builtin: true,
		browser: true,
	},
	/** @see {@link https://github.com/ota-meshi/eslint-plugin-regexp/issues/1033} */
	ignorePatterns: ["**/*.d.ts", "**/*.d.json.ts"],
	jsPlugins: [{ name: "check-file", specifier: "eslint-plugin-check-file" }],
	options: {
		reportUnusedDisableDirectives: "error",
		typeAware: true,
		typeCheck: true,
	},
	rules: {
		"arrow-body-style": ["error", "always"],
		/** Not enabled yet - switching to logical properties is a separate, ui-wide change. */
		"better-tailwindcss/enforce-logical-properties": "off",
		"no-restricted-imports": ["error", restrictedImports],
		"typescript/explicit-module-boundary-types": "off",
		/** Avoid hardcoded, non-translated strings. */
		"react/jsx-no-literals": [
			"error",
			{
				allowedStrings: [
					"&amp;",
					"&apos;",
					"&copy;",
					"&gt;",
					"&lt;",
					"&nbsp;",
					"&quot;",
					"&rarr;",
					"&larr;",
					"&mdash;",
					"&ndash;",
					".",
					"!",
					":",
					";",
					",",
					"-",
					"(",
					")",
				],
			},
		],
		/** Superseded by `check-file/filename-naming-convention`, which ignores middle extensions. */
		"unicorn/filename-case": "off",
		"check-file/filename-naming-convention": [
			"error",
			{ "**/*": "KEBAB_CASE" },
			{ ignoreMiddleExtensions: true },
		],
		"check-file/folder-naming-convention": ["error", { "**/": "NEXT_JS_APP_ROUTER_CASE" }],
	},
	/**
	 * `settings` is not inherited through `extends` - the entry config's value is used verbatim - so the shared configs
	 * export their settings instead of declaring them, and they are composed here.
	 */
	settings: {
		"better-tailwindcss": {
			...betterTailwindcssSettings,
			cwd: import.meta.dirname,
			entryPoint: path.join(import.meta.dirname, "./styles/index.css"),
		},
		react: reactSettings,
	},
	overrides: [
		{
			files: [
				"config/oxlint/*.ts",
				"keystatic.config.tsx",
				/** `next-intl` requires a default export. */
				"lib/i18n/request.ts",
				"oxfmt.config.ts",
				"oxlint.config.ts",
				"x18n.config.ts",
			],
			rules: {
				"import/no-default-export": "off",
			},
		},
		{
			files: ["config/env.config.ts"],
			rules: {
				"node/no-process-env": "off",
			},
		},
	],
});

export default config;
