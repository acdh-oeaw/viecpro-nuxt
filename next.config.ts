import createBundleAnalyzer from "@next/bundle-analyzer";
import localesPlugin from "@react-aria/optimize-locales-plugin";
import type { NextConfig } from "next";
import createI18nPlugin from "next-intl/plugin";

import { env } from "@/config/env.config";

const config: NextConfig = {
	/** Compression should be handled by nginx reverse proxy. */
	compress: false,
	eslint: {
		dirs: [process.cwd()],
		ignoreDuringBuilds: true,
	},
	experimental: {
		// dynamicIO: true,
		// ppr: true,
		reactCompiler: true,
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
	webpack(config, { isServer }) {
		/**
		 * @see https://react-spectrum.adobe.com/react-aria/ssr.html#nextjs-app-router
		 */
		if (!isServer) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
			config.plugins.push(localesPlugin.webpack({ locales: [] }));
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return config;
	},
};

const plugins: Array<(config: NextConfig) => NextConfig> = [
	createBundleAnalyzer({ enabled: env.BUNDLE_ANALYZER === "enabled" }),
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
