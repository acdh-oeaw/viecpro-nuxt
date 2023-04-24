/** @typedef {import('next').NextConfig} NextConfig */

import createBundleAnalyzer from "@next/bundle-analyzer";
import createMdxPlugin from "@next/mdx";
import { log } from "@stefanprobst/log";
import ms from "ms";
import createI18nPlugin from "next-intl/plugin";

/** @type {NextConfig} */
const config = {
	eslint: {
		dirs: [process.cwd()],
		ignoreDuringBuilds: true,
	},
	experimental: {
		appDir: true,
	},
	async headers() {
		/** @type {Awaited<ReturnType<NonNullable<NextConfig['headers']>>>} */
		const headers = [];

		/**
		 * Cache all content pages.
		 *
		 * @see https://next-intl-docs.vercel.app/docs/next-13/server-components#cdn-caching
		 */
		headers.push({
			source: "/((?!_next|.*\\..*).*)",
			headers: [
				{
					key: "Cache-Control",
					value: [`s-maxage=${ms("1d") / 1000}`, `stale-while-revalidate=${ms("1y") / 1000}`].join(
						", ",
					),
				},
			],
			/**
			 * For hosts which do not support the `Vary` header (e.g. Vercel), ensure caching for
			 * prefetch requests of Server Components is disabled.
			 *
			 * @see https://github.com/vercel/vercel/discussions/7612#discussioncomment-2434736
			 */
			missing: [
				{
					type: "header",
					key: "Next-Router-Prefetch",
				},
			],
		});

		/**
		 * Only allow indexing by search engines when the `BOTS` environment variable is set.
		 */
		if (process.env.BOTS !== "enabled") {
			headers.push({
				source: "/:path*",
				headers: [
					{
						key: "X-Robots-Tag",
						value: "noindex, nofollow",
					},
				],
			});

			log.warn("Indexing by search engines is disallowed.");
		}

		return headers;
	},
	output: "standalone",
	/** `react-aria-components` is not yet fully compatible with strict mode. */
	reactStrictMode: false,
	typescript: {
		ignoreBuildErrors: true,
	},
};

/** @type {Array<(config: NextConfig) => NextConfig>} */
const plugins = [
	createBundleAnalyzer({ enabled: process.env.BUNDLE_ANALYZER === "enabled" }),
	// @ts-expect-error Upstream type issue.
	createI18nPlugin(),
	createMdxPlugin(),
];

export default plugins.reduce((config, plugin) => {
	return plugin(config);
}, config);
