import { fileURLToPath } from "node:url";

import { defaultLocale, locales } from "./config/i18n.config";

export default defineNuxtConfig({
	alias: {
		"@": fileURLToPath(new URL("./src", import.meta.url)),
		"~": fileURLToPath(new URL("./", import.meta.url)),
	},
	content: {
		defaultLocale,
		locales: Object.keys(locales),
		markdown: {
			anchorLinks: false,
			remarkPlugins: [],
			rehypePlugins: [],
		},
	},
	css: [
		"@fontsource-variable/roboto-flex/standard.css",
		"tailwindcss/tailwind.css",
		"@/styles/index.css",
	],
	devtools: {
		enabled: true,
	},
	dir: {
		public: "../public",
	},
	i18n: {
		baseUrl: process.env.VITE_APP_BASE_URL,
		defaultLocale,
		detectBrowserLanguage: {
			redirectOn: "root",
		},
		langDir: "./messages",
		lazy: true,
		locales: Object.values(locales),
		// TODO: revisit using `prefix_except_default`
		strategy: "prefix",
	},
	modules: ["@nuxt/content", "@nuxt/devtools", "@nuxtjs/i18n", "@nuxt/image"],
	nitro: {
		compressPublicAssets: true,
	},
	postcss: {
		plugins: {
			"tailwindcss/nesting": "postcss-nesting",
			tailwindcss: {},
			autoprefixer: {},
		},
	},
	routeRules: {
		"**/*": {
			headers: process.env.BOTS !== "enabled" ? { "X-Robots-Tag": "noindex, nofollow" } : {},
		},
		"/": { static: true },
		"/imprint": { static: true },
	},

	runtimeConfig: {
		BOTS: process.env.BOTS,
		ENV_VALIDATION: process.env.ENV_VALIDATION,
		NODE_ENV: process.env.NODE_ENV,
		public: {
			NUXT_PUBLIC_APP_BASE_URL: process.env.NUXT_PUBLIC_APP_BASE_URL,
			NUXT_PUBLIC_MATOMO_BASE_URL: process.env.NUXT_PUBLIC_MATOMO_BASE_URL,
			NUXT_PUBLIC_MATOMO_ID: process.env.NUXT_PUBLIC_MATOMO_ID,
			NUXT_PUBLIC_REDMINE_ID: process.env.NUXT_PUBLIC_REDMINE_ID,
			NUXT_PUBLIC_TYPESENSE_API_KEY: process.env.NUXT_PUBLIC_TYPESENSE_API_KEY,
			NUXT_PUBLIC_TYPESENSE_PORT: process.env.NUXT_PUBLIC_TYPESENSE_PORT,
			NUXT_PUBLIC_TYPESENSE_PROTOCOL: process.env.NUXT_PUBLIC_TYPESENSE_PROTOCOL,
			NUXT_PUBLIC_TYPESENSE_HOST: process.env.NUXT_PUBLIC_TYPESENSE_HOST,
			NUXT_PUBLIC_TYPESENSE_COLLECTION_PREFIX: process.env.NUXT_PUBLIC_TYPESENSE_COLLECTION_PREFIX,
		},
	},
	srcDir: "./src/",
	typescript: {
		shim: false,
		strict: true,
		// https://github.com/nuxt/nuxt/issues/14816#issuecomment-1484918081
		tsConfig: {
			compilerOptions: {
				paths: {
					"@/*": ["./src/*"],
					"~/*": ["./*"],
				},
			},
		},
	},
});
