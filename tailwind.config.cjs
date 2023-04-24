/** @typedef {import('tailwindcss').Config} TailwindConfig */

const typographyPlugin = require("@tailwindcss/typography");
const colors = require("tailwindcss/colors");
const animatePlugin = require("tailwindcss-animate");

const neutral = colors.slate;
const negative = colors.red;
const primary = colors.slate;

/** @type {TailwindConfig} */
const config = {
	content: [
		"./content/**/*.mdx",
		"./src/app/**/*.@(css|ts|tsx)",
		"./src/components/**/*.@(css|ts|tsx)",
	],
	darkMode: ["class", '[data-color-scheme="dark"]'],
	plugins: [animatePlugin, typographyPlugin],
	theme: {
		extend: {
			colors: {
				neutral,
				negative,
				primary,
			},
			fontFamily: {
				body: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
			},
		},
	},
};

module.exports = config;
