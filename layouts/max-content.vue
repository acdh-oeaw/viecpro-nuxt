<script lang="ts" setup>
import { computed } from "vue";

import { metadata } from "@/config/metadata.config";
import { useHead, useRoute } from "#imports";

const route = useRoute();
const { locale, t } = useI18n();
const meta = computed(() => {
	return metadata[locale.value];
});

useHead({
	htmlAttrs: {
		lang() {
			return locale.value;
		},
	},
	title() {
		return t(route.meta.title);
	},
	titleTemplate(title) {
		return [title, meta.value.title].join(" - ");
	},
	meta: [
		{ name: "description", content: meta.value.description },
		{ name: "theme-color", content: "#3C5A50" },
	],
});
</script>

<template>
	<div class="grid min-h-screen grid-rows-[auto_1fr]">
		<SkipLink />
		<AppHeader compact />
		<slot />
	</div>
</template>
