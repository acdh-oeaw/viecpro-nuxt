import headlessui from "@headlessui/tailwindcss";
import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";
import animate from "tailwindcss-animate";

const neutral = colors.slate;
const negative = colors.red;

const primary = {
	50: "#f5f8f6",
	100: "#dee9e4",
	200: "#bcd3c8",
	300: "#93b5a7",
	400: "#6d9485",
	500: "#527a6b",
	600: "#3c5a50",
	700: "#364f47",
	800: "#2e413a",
	900: "#293833",
	950: "#141f1b",
};
const secondary = {
	100: "#159199",
	200: "#00838b",
	300: "#00757d",
	400: "#00676f",
	500: "#005961",
	600: "#004c54",
	700: "#003f47",
	800: "#00333b",
	900: "#00272f",
};
const highlight = {
	100: "#fcff00",
	200: "#dee300",
	300: "#c0c800",
	400: "#a3ae00",
	500: "#879400",
	600: "#6c7b00",
	700: "#536300",
	800: "#3f4c00",
	900: "#323500",
};

const config: Config = {
	content: ["./@(components|layouts|pages|styles)/**/*.@(css|ts|vue)", "./content/**/*.@(md|mdc)"],
	plugins: [animate, headlessui, typography],
	theme: {
		extend: {
			animationDelay: {
				"2s": "2s",
			},
			colors: {
				neutral,
				negative,
				primary,
				secondary,
				highlight,
			},
			fontFamily: {
				sans: ["Roboto Flex Variable", "ui-sans-serif", "system-ui", "sans-serif"],
			},
			maxWidth: {
				container: "80rem",
				content: "64rem",
			},
			keyframes: {
				loadingBar: {
					"0%, 60%": {
						left: "-90%",
						right: "100%",
					},
					"100%": {
						left: "100%",
						right: "-35%",
					},
				},
				slideDown: {
					from: { height: "0px" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				slideUp: {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0px" },
				},
				slideDownAndFade: {
					from: { opacity: "0%", transform: "translateY(-10px)" },
					to: { opacity: "100%", transform: "translateY(0)" },
				},
				slideUpAndFade: {
					from: { opacity: "0", transform: "translateY(10px)" },
					to: { opacity: "1", transform: "translateY(0)" },
				},
			},
			animation: {
				slideUpAndFade: "slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
				slideDownAndFade: "slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
				slideDown: "slideDown 300ms cubic-bezier(0.87, 0, 0.13, 1)",
				slideUp: "slideUp 300ms cubic-bezier(0.87, 0, 0.13, 1)",
				loadingBar: "loadingBar 4s cubic-bezier(0.87, 0, 0.13, 1) infinite",
			},

			typography: {
				DEFAULT: {
					css: {
						maxWidth: null,
						h1: {
							hyphens: "auto",
						},
					},
				},
			},
		},
	},
};

export default config;
