/** @typedef {import('tailwindcss').Config} TailwindConfig */

const headlessui = require("@headlessui/tailwindcss");
const typography = require("@tailwindcss/typography");
const colors = require("tailwindcss/colors");
const animate = require("tailwindcss-animate");

const neutral = colors.slate;
const negative = colors.red;
const primary = {
	100: "#3c5a50",
	200: "#345148",
	300: "#2c4940",
	400: "#244138",
	500: "#1c3930",
	600: "#143128",
	700: "#0c2921",
	800: "#04221a",
	900: "#001b12",
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

/** @type {TailwindConfig} */
const config = {
	content: ["./src/**/*.@(css|ts|vue)"],
	plugins: [animate, headlessui, typography],
	theme: {
		extend: {
			colors: {
				neutral,
				negative,
				primary,
				secondary,
				highlight,
			},
			fontFamily: {
				sans: ["Roboto FlexVariable", "ui-sans-serif", "system-ui", "sans-serif"],
			},
			maxWidth: {
				container: "80rem",
				content: "64rem",
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

module.exports = config;
