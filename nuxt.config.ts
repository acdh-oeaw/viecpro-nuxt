import { fileURLToPath } from "node:url";

import { defaultLocale, localesMap } from "./config/i18n.config";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const baseUrl = process.env.NUXT_PUBLIC_APP_BASE_URL!;

export default defineNuxtConfig({
	alias: {
		"@": fileURLToPath(new URL("./", import.meta.url)),
	},
	app: {
		layoutTransition: false,
		pageTransition: false,
	},
	components: [{ path: "@/components", extensions: [".vue"], pathPrefix: false }],
	content: {
		defaultLocale,
		locales: Object.keys(localesMap),
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
	devtools: {
		enabled: true,
	},
	experimental: {
		componentIslands: {
			selectiveClient: true,
		},
		defaults: {
			useAsyncData: {
				deep: false,
			},
			useFetch: {
				timeout: 250,
			},
		},
		inlineRouteRules: true,
	},
	features: {
		/** @see https://github.com/nuxt/nuxt/issues/21821 */
		inlineStyles: false,
	},
	future: {
		compatibilityVersion: 4,
	},
	i18n: {
		baseUrl,
		defaultLocale,
		detectBrowserLanguage: {
			redirectOn: "root",
		},
		langDir: "./messages",
		lazy: true,
		locales: Object.values(localesMap),
		strategy: "prefix",
		vueI18n: "./i18n.config.ts",
	},
	imports: {
		dirs: ["./config/"],
	},
	modules: ["@nuxt/content", "@nuxt/image", "@nuxtjs/i18n", "nuxt3-leaflet", "@vueuse/nuxt"],
	nitro: {
		compressPublicAssets: true,
		prerender: {
			routes: ["/manifest.webmanifest", "/robots.txt", "/sitemap.xml"],
		},
	},
	postcss: {
		plugins: {
			"tailwindcss/nesting": {},
			tailwindcss: {},
			autoprefixer: {},
		},
	},
	runtimeConfig: {
		NODE_ENV: process.env.NODE_ENV,
		public: {
			appBaseUrl: process.env.NUXT_PUBLIC_APP_BASE_URL,
			bots: process.env.NUXT_PUBLIC_BOTS,
			googleSiteVerification: process.env.NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
			matomoBaseUrl: process.env.NUXT_PUBLIC_MATOMO_BASE_URL,
			matomoId: process.env.NUXT_PUBLIC_MATOMO_ID,
			redmineId: process.env.NUXT_PUBLIC_REDMINE_ID,
			typesenseApiKey: process.env.NUXT_PUBLIC_TYPESENSE_API_KEY,
			typesenseCollectionPrefix: process.env.NUXT_PUBLIC_TYPESENSE_COLLECTION_PREFIX,
			typesenseHost: process.env.NUXT_PUBLIC_TYPESENSE_HOST,
			typesensePort: process.env.NUXT_PUBLIC_TYPESENSE_PORT,
			typesenseProtocol: process.env.NUXT_PUBLIC_TYPESENSE_PROTOCOL,
		},
	},
	typescript: {
		shim: false,
		strict: true,
		// https://github.com/nuxt/nuxt/issues/14816#issuecomment-1484918081
		tsConfig: {
			compilerOptions: {
				baseUrl: ".",
				paths: {
					"@/*": ["./*"],
				},
			},
		},
	},
});
