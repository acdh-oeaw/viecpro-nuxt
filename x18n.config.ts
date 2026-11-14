import { defineConfig } from "@x18n/core";

const config = defineConfig({
	sourceLocale: "de",
	presets: ["next-intl"],
	resources: [
		{ pattern: "messages/{locale}.json" },
		{ pattern: "content/{locale}/metadata/index.json", namespace: "metadata" },
	],
	keyStyle: "nested",
	write: {
		sort: "binary",
		indent: "tab",
		keepFilled: true,
	},
	review: {
		enabled: false,
	},
});

export default config;
