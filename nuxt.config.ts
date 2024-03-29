import { fileURLToPath } from "node:url";

import { defineNuxtConfig } from "nuxt/config";

import { defaultLocale, locales } from "./config/i18n.config";

export default defineNuxtConfig({
	alias: {
		"@": fileURLToPath(new URL("./", import.meta.url)),
	},
	components: [{ path: "@/components", extensions: [".vue"], pathPrefix: false }],
	content: {
		// defaultLocale,
		// documentDriven: true,
		locales: Object.keys(locales),
		markdown: {
			anchorLinks: false,
			rehypePlugins: ["rehype-mermaid"],
		},
	},
	css: [
		"@fontsource-variable/roboto-flex/standard.css",
		"tailwindcss/tailwind.css",
		"@/styles/index.css",
	],
	i18n: {
		baseUrl: process.env.NUXT_PUBLIC_APP_BASE_URL,
		defaultLocale,
		detectBrowserLanguage: {
			redirectOn: "root",
		},
		langDir: "./locales",
		lazy: true,
		locales: Object.values(locales),
		strategy: "prefix",
		vueI18n: "./i18n.config.ts",
	},
	modules: ["@nuxt/content", "@nuxt/image", "@nuxtjs/i18n", "nuxt3-leaflet"],
	nitro: {
		compressPublicAssets: true,
	},
	plugins: ["@/plugins/query-client.ts"],
	postcss: {
		plugins: {
			"tailwindcss/nesting": {},
			tailwindcss: {},
			autoprefixer: {},
		},
	},
	routeRules: {
		"/": { static: true },
		"/imprint": { static: true },
	},
	runtimeConfig: {
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
	typescript: {
		shim: false,
		strict: true,
		// https://github.com/nuxt/nuxt/issues/14816#issuecomment-1484918081
		tsConfig: {
			compilerOptions: {
				paths: {
					"@/*": ["./*"],
				},
			},
		},
	},
});
