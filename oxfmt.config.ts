import { defineConfig } from "oxfmt";

const config = defineConfig({
	ignorePatterns: ["pnpm-workspace.yaml", "*.mdx", "content/", "public/"],
	printWidth: 100,
	proseWrap: "always",
	sortImports: {
		groups: [
			["side_effect"],
			["side_effect_style"],
			["style"],
			["builtin"],
			["external"],
			["internal", "subpath"],
			["unknown"],
		],
	},
	sortPackageJson: {
		sortScripts: true,
	},
	useTabs: true,
});

export default config;
