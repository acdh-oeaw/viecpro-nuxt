import { createI18n } from "vue-i18n";

import de from "~/i18n/messages/de.json";

const locale = "de";

const { t } = createI18n({ legacy: false, locale, messages: { de } }).global;

const manifest = {
	name: t("Manifest.name"),
	short_name: t("Manifest.short-name"),
	description: t("Manifest.description"),
	start_url: "/",
	display: "standalone",
	background_color: "#fff",
	theme_color: "#fff",
	icons: [
		{ src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
		{ src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
	],
};

export default defineEventHandler((event) => {
	defaultContentType(event, "application/manifest+json");
	return manifest;
});
