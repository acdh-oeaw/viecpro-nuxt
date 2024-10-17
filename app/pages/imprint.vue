<script setup lang="ts">
import { createImprintUrl } from "@/config/imprint.config";

defineRouteRules({
	prerender: true,
});

const locale = useLocale();
const t = useTranslations();

usePageMetadata({
	title: t("ImprintPage.meta.title"),
});

const env = useRuntimeConfig();

const { data: html } = await useFetch(
	String(createImprintUrl(locale.value, env.public.redmineId)),
	{
		responseType: "text",
		onResponseError(error) {
			throw createError({ fatal: true, statusCode: error.response.status });
		},
		watch: [locale],
	},
);
</script>

<template>
	<MainContent class="mx-auto w-full max-w-container p-2">
		<div class="prose prose-sm md:prose-base">
			<h1>{{ t("ImprintPage.title") }}</h1>
			<div v-html="html" />
		</div>
	</MainContent>
</template>
