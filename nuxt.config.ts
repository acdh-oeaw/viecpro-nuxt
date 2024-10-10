import { fileURLToPath } from "node:url";

import { defaultLocale, localesMap } from "./app/config/i18n.config";

const baseUrl = process.env.NUXT_PUBLIC_APP_BASE_URL!;

export default defineNuxtConfig({
	alias: {
		"@": fileURLToPath(new URL("./app/", import.meta.url)),
		"~": fileURLToPath(new URL("./", import.meta.url)),
	},
	app: {
		layoutTransition: false,
		pageTransition: false,
	},
	components: [{ extensions: [".vue"], path: "@/components", pathPrefix: false }],
	content: {
		defaultLocale,
		locales: Object.keys(localesMap),
		markdown: {
			anchorLinks: false,
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
	eslint: {
		config: {
			autoInit: false,
			standalone: true,
		},
	},
	experimental: {
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
		langDir: "messages",
		lazy: true,
		locales: Object.values(localesMap),
		strategy: "no_prefix",
	},
	imports: {
		dirs: ["./config/"],
	},
	modules: [
		"@nuxt/content",
		"@nuxt/eslint",
		"@nuxt/image",
		"@nuxtjs/i18n",
		"@vueuse/nuxt",
		"nuxt3-leaflet",
	],
	nitro: {
		compressPublicAssets: true,
		prerender: {
			routes: ["/manifest.webmanifest", "/robots.txt", "/sitemap.xml"],
		},
	},
	postcss: {
		plugins: {
			tailwindcss: {},
		},
	},
	runtimeConfig: {
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
					"@/*": ["./app/*"],
					"~/*": ["./*"],
				},
			},
		},
	},
});
