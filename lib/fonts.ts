import { Roboto_Flex } from "next/font/google";

export const body = Roboto_Flex({
	axes: ["opsz", "slnt"],
	display: "swap",
	style: ["normal"],
	subsets: ["latin", "latin-ext"],
	variable: "--_font-body",
});

export const heading = Roboto_Flex({
	axes: ["opsz", "slnt"],
	display: "swap",
	style: ["normal"],
	subsets: ["latin", "latin-ext"],
	variable: "--_font-heading",
});
