<script lang="ts" setup>
import { computed } from "vue";

import AppFooter from "@/components/app-footer.vue";
import AppHeader from "@/components/app-header.vue";
import SkipLink from "@/components/skip-link.vue";
import { useI18n } from "@/lib/i18n/use-i18n";
import { useHead, useLocaleHead, useLocalePath, useRoute } from "#imports";
import { manifestFileName, metadata, openGraphImageName } from "~/config/metadata.config";

const route = useRoute();

const { locale, t } = useI18n();
const localePath = useLocalePath();

const meta = computed(() => {
	return metadata[locale.value];
});

const i18nHead = useLocaleHead({
	addDirAttribute: true,
	identifierAttribute: "id",
	addSeoAttributes: true,
});

useHead({
	htmlAttrs: {
		lang: computed(() => {
			return locale.value;
			// return i18nHead.value.htmlAttrs!.lang; // adds full iso code
		}),
	},
	link: computed(() => {
		return [
			{ href: localePath("/favicon.ico"), rel: "icon", sizes: "any" },
			{ href: localePath("/icon.svg"), rel: "icon", type: "image/svg+xml" },
			{ href: localePath("/apple-touch-icon.png"), rel: "apple-touch-icon" },
			{ href: localePath("/" + manifestFileName), rel: "manifest" },
			...(i18nHead.value.link ?? []),
		];
	}),
	meta: computed(() => {
		return [
			{ name: "description", content: meta.value.description },
			{ property: "og:type", content: "website" },
			{ property: "og:title", content: meta.value.title },
			{ property: "og:site_name", content: meta.value.title },
			{ property: "og:description", content: meta.value.description },
			{ property: "og:image", content: localePath("/" + openGraphImageName) },
			// { property: "og:locale", content: meta.locale }, // added via `useLocaleHead`
			...(i18nHead.value.meta ?? []),
		];
	}),
	title: computed(() => {
		return t(route.meta.title);
	}),
	titleTemplate(title) {
		return [title, meta.value.title].join(" | ");
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
