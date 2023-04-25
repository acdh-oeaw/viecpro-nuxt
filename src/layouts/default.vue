<script lang="ts" setup>
import AppFooter from "@/components/app-footer.vue";
import AppHeader from "@/components/app-header.vue";
import SkipLink from "@/components/skip-link.vue";
import { useHead, useI18n, useLocaleHead, useLocalePath, useRoute } from "#imports";
import { type Locale, type Schema } from "~/config/i18n.config";
import { manifestFileName, metadata, openGraphImageName } from "~/config/metadata.config";

const route = useRoute();

const { locale, t } = useI18n<Schema, Locale>();
const localePath = useLocalePath();

const meta = metadata[locale.value];

const i18nHead = useLocaleHead({
	addDirAttribute: true,
	identifierAttribute: "id",
	addSeoAttributes: true,
});

useHead({
	htmlAttrs: {
		lang: locale.value,
		// lang: i18nHead.value.htmlAttrs!.lang // adds full iso code
	},
	link: [
		{ href: localePath("/favicon.ico"), rel: "icon", sizes: "any" },
		{ href: localePath("/icon.svg"), rel: "icon", type: "image/svg+xml" },
		{ href: localePath("/apple-touch-icon.png"), rel: "apple-touch-icon" },
		{ href: localePath("/" + manifestFileName), rel: "manifest" },
		...(i18nHead.value.link ?? []),
	],
	meta: [
		{ name: "description", content: meta.description },
		{ property: "og:type", content: "website" },
		{ property: "og:title", content: meta.title },
		{ property: "og:site_name", content: meta.title },
		{ property: "og:description", content: meta.description },
		{ property: "og:image", content: localePath("/" + openGraphImageName) },
		// { property: "og:locale", content: meta.locale }, // added via `useLocaleHead`
		...(i18nHead.value.meta ?? []),
	],
	title: t(route.meta.title),
	titleTemplate(title) {
		return [title, meta.title].join(" | ");
	},
});
</script>

<template>
	<div class="grid min-h-full grid-rows-[auto_1fr_auto]">
		<SkipLink />
		<AppHeader />
		<slot />
		<AppFooter />
	</div>
</template>
