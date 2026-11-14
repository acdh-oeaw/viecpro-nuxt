import localesPlugin from "@react-aria/optimize-locales-plugin";
import type { NextConfig } from "next";
import createI18nPlugin from "next-intl/plugin";

import { env } from "#/config/env.config.ts";

/** `@react-aria/optimize-locales-plugin` types loader options as `readonly`, which next.js rejects. */
type TurbopackRules = NonNullable<NonNullable<NextConfig["turbopack"]>["rules"]>;

const config: NextConfig = {
	/** Compression should be handled by nginx reverse proxy. */
	compress: false,
	experimental: {
		useCache: true,
	},
	headers() {
		const headers: Awaited<ReturnType<NonNullable<NextConfig["headers"]>>> = [
			/** @see https://nextjs.org/docs/app/building-your-application/deploying#streaming-and-suspense */
			{
				source: "/:path*{/}?",
				headers: [
					{
						key: "X-Accel-Buffering",
						value: "no",
					},
				],
			},
		];

		return Promise.resolve(headers);
	},
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
	output: env.BUILD_MODE,
	reactCompiler: true,
	redirects() {
		const redirects: Awaited<ReturnType<NonNullable<NextConfig["redirects"]>>> = [
			{
				source: "/documentation",
				destination: "/documentation/project",
				permanent: false,
			},
			{
				source: "/search",
				destination: "/search/persons",
				permanent: false,
			},
			{
				source: "/admin",
				destination: "/keystatic",
				permanent: false,
			},
		];

		return Promise.resolve(redirects);
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	turbopack: {
		rules: {
			/**
			 * Strip react aria's bundled translations from the client bundle, since
			 * `LocalizedStringProvider` injects the current locale's strings into the initial html.
			 *
			 * @see https://react-spectrum.adobe.com/react-aria/ssr.html#nextjs-app-router
			 */
			...(localesPlugin.turbopack([{ locales: [], condition: "browser" }]).rules as TurbopackRules),
		},
	},
};

const plugins: Array<(config: NextConfig) => NextConfig> = [
	createI18nPlugin({
		experimental: {
			/** @see https://v4.next-intl.dev/docs/workflows/typescript#messages-arguments */
			createMessagesDeclaration: "./messages/de.json",
		},
		requestConfig: "./lib/i18n/request.ts",
	}),
];

export default plugins.reduce((config, plugin) => {
	return plugin(config);
}, config);
