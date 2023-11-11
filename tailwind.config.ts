import { createPreset } from "@acdh-oeaw/tailwindcss-preset";
import type { Config } from "tailwindcss";

const designTokensPreset = createPreset();

const config = {
	content: [
		"./app.vue",
		"./error.vue",
		"./components/**/*.@(css|ts|vue)",
		"./content/**/*.md",
		"./layouts/**/*.@(css|ts|vue)",
		"./pages/**/*.@(css|ts|vue)",
	],
	presets: [designTokensPreset],
	theme: {
		extend: {
			borderRadius: {
				DEFAULT: "var(--radius-md)",
			},
			colors: {
				brand: {
					"50": "#f5f8f6",
					"100": "#dee9e4",
					"200": "#bcd3c8",
					"300": "#93b5a7",
					"400": "#6d9485",
					"500": "#527a6b",
					"600": "#3c5a50",
					"700": "#364f47",
					"800": "#2e413a",
					"900": "#293833",
					"950": "#141f1b",
				},
			},
		},
	},
} satisfies Config;

export default config;
