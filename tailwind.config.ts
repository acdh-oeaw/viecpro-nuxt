import typographyPlugin from "@tailwindcss/typography";
import type { Config } from "tailwindcss";
import animatePlugin from "tailwindcss-animate";
import reactAriaComponentsPlugin from "tailwindcss-react-aria-components";

const config = {
	content: ["./@(app|components|config|lib|styles)/**/*.@(css|js|ts|tsx)"],
	corePlugins: {
		container: false,
	},
	plugins: [animatePlugin, reactAriaComponentsPlugin, typographyPlugin],
	theme: {
		extend: {
			colors: {
				/** mineral-green */
				brand: {
					"50": "#f5f8f6",
					"100": "#dee9e5",
					"200": "#bdd2c9",
					"300": "#94b4a8",
					"400": "#6d9486",
					"500": "#53796d",
					"600": "#3c5950",
					"700": "#374e48",
					"800": "#2f403b",
					"900": "#2a3733",
					"950": "#151e1c",
				},
			},
			fontFamily: {
				body: "var(--font-body, ui-sans-serif), system-ui, sans-serif",
				heading: "var(--font-heading, var(--font-body))",
			},
			screens: {
				xs: "30rem",
				sm: "40rem",
				md: "48rem",
				lg: "64rem",
				xl: "80rem",
				"2xl": "96rem",
				"3xl": "120rem",
			},
			typography: {
				DEFAULT: {
					css: {
						maxWidth: null,
					},
				},
			},
		},
	},
} satisfies Config;

export default config;
