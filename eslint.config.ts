import * as path from "node:path";

import baseConfig from "@acdh-oeaw/eslint-config";
import nextConfig from "@acdh-oeaw/eslint-config-next";
import nodeConfig from "@acdh-oeaw/eslint-config-node";
import playwrightConfig from "@acdh-oeaw/eslint-config-playwright";
import reactConfig from "@acdh-oeaw/eslint-config-react";
import tailwindcssConfig from "@acdh-oeaw/eslint-config-tailwindcss";
import { defineConfig } from "eslint/config";
import gitignore from "eslint-config-flat-gitignore";
import checkFilePlugin from "eslint-plugin-check-file";

const config = defineConfig(
	gitignore({ strict: false }),
	baseConfig,
	reactConfig,
	nextConfig,
	{
		name: "tailwindcss-config",
		extends: [tailwindcssConfig],
		settings: {
			"better-tailwindcss": {
				entryPoint: path.resolve("./styles/index.css"),
			},
		},
	},
	playwrightConfig,
	{
		plugins: {
			"check-file": checkFilePlugin,
		},
		rules: {
			"check-file/filename-naming-convention": [
				"error",
				{
					"**/*": "KEBAB_CASE",
				},
				{ ignoreMiddleExtensions: true },
			],
			"check-file/folder-naming-convention": [
				"error",
				{
					"**/": "NEXT_JS_APP_ROUTER_CASE",
				},
			],
		},
	},
	{
		rules: {
			"arrow-body-style": ["error", "always"],
			"no-restricted-imports": [
				"error",
				{
					name: "next/image",
					message: "Please use `@/components/image` or `@/components/server-image` instead.",
				},
				{
					name: "next/link",
					message: "Please use `@/components/link` instead.",
				},
				{
					name: "next/navigation",
					importNames: ["redirect", "permanentRedirect", "useRouter", "usePathname"],
					message: "Please use `@/lib/i18n/navigation` instead.",
				},
				{
					name: "next/router",
					message: "Please use `@/lib/i18n/navigation` instead.",
				},
			],
			"no-restricted-syntax": [
				"error",
				{
					selector: 'MemberExpression[computed!=true][object.name="process"][property.name="env"]',
					message: "Please use `@/config/env.config` instead.",
				},
			],
			// "@typescript-eslint/explicit-module-boundary-types": "error",
			"@typescript-eslint/require-array-sort-compare": "error",
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
			// "@typescript-eslint/strict-boolean-expressions": "error",
			"react/jsx-sort-props": ["error", { reservedFirst: true }],
		},
	},
	{
		files: ["db/**/*.ts", "lib/server/**/*.ts", "**/_actions/**/*.ts"],
		extends: [nodeConfig],
	},
);

export default config;
