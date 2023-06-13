import typographyPlugin from "@tailwindcss/typography";
import { type Config } from "tailwindcss";
import colors from "tailwindcss/colors.js";
import animatePlugin from "tailwindcss-animate";

const neutral = colors.slate;

const config: Config = {
	content: [
		"./src/components/**/*.@(css|ts|vue)",
		"./src/content/**/*.md",
		"./src/layouts/**/*.@(css|ts|vue)",
		"./src/pages/**/*.@(css|ts|vue)",
	],
	plugins: [animatePlugin, typographyPlugin],
	theme: {
		extend: {
			colors: {
				neutral,
				primary: {
					foreground: "#3c5a50",
					background: "#3c5a50",
				},
				"focus-ring": "#3c5a50",
			},
			container: {
				center: true,
				padding: "1rem",
				screens: {
					"2xl": "1536px",
				},
			},
			fontFamily: {
				body: ["Roboto Flex Variable", "ui-sans-serif", "system-ui", "sans-serif"],
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
};

export default config;
