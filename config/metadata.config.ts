import type { FitEnum } from "sharp";

import type { Locale } from "@/config/i18n.config";

interface Metadata {
	locale: Locale;
	title: string;
	shortTitle: string;
	description: string;
	logo: {
		path: string;
		fit: keyof FitEnum;
		maskable: boolean;
	};
	image: {
		path: string;
		fit: keyof FitEnum;
	};
	twitter: {
		handle: string;
	};
	creator: {
		name: string;
		shortName: string;
		website: string;
	};
}

export const metadata: Record<Locale, Metadata> = {
	de: {
		locale: "de",
		title: "VieCPro",
		shortTitle: "VieCPro",
		description: "The Viennese Court. A prosopographical portal.",
		logo: {
			path: "./public/assets/images/logo-acdh.svg",
			fit: "contain",
			maskable: false,
		},
		image: {
			path: "./public/assets/images/logo-acdh.svg",
			fit: "contain",
		},
		twitter: {
			handle: "",
		},
		creator: {
			name: "Austrian Centre for Digital Humanities and Cultural Heritage",
			shortName: "ACDH-CH",
			website: "https://www.oeaw.ac.at/de/acdh",
		},
	},
	en: {
		locale: "en",
		title: "VieCPro",
		shortTitle: "VieCPro",
		description: "The Viennese Court. A prosopographical portal.",
		logo: {
			path: "/public/assets/images/logo-acdh.svg",
			fit: "contain",
			maskable: false,
		},
		image: {
			path: "/public/assets/images/logo-acdh.svg",
			fit: "contain",
		},
		twitter: {
			handle: "",
		},
		creator: {
			name: "Austrian Centre for Digital Humanities and Cultural Heritage",
			shortName: "ACDH-CH",
			website: "https://www.oeaw.ac.at/acdh",
		},
	},
};

export const manifestFileName = "app.webmanifest";

export const openGraphImageName = "image.webp";
