import { defineConfig } from "@eloqnt/cli";

export default defineConfig({
	srcPath: ["./app", "./components", "./config", "./lib"],
	messages: {
		/**
		 * `content/{locale}/metadata/index.json` is merged into messages under the `metadata` namespace
		 * (see `lib/i18n/request.ts`).
		 */
		path: ["./messages", "./content/{locale}/{namespace}/index"],
		locales: "infer",
		sourceLocale: "de",
		format: "json",
	},
	lint: {
		overrides: [
			{
				/**
				 * The `{namespace}` pattern also matches content collections, which are not loaded as
				 * messages.
				 */
				keys: ["documentation-nav.*", "index-page.*"],
				rules: { "orphan-message": "off" },
			},
		],
	},
});
