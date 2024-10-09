<script setup lang="ts">
import markdownParser from "@nuxt/content/transformers/markdown";
import { useQuery } from "@tanstack/vue-query";
import { Loader2 } from "lucide-vue-next";

import { getImprint } from "@/lib/get-imprint";

defineRouteRules({
	prerender: true,
});

const parseMarkdown = (md: string) => markdownParser.parse("imprint.md", md);

const t = useTranslations();
const { locale } = useI18n();

const { data: imprintMd, isFetching } = useQuery({
	queryKey: ["imprint", locale] as const,
	queryFn: async ({ queryKey }) => {
		const [, locale] = queryKey;
		const ret = await parseMarkdown(await (await getImprint(locale)).text());

		return ret;
	},
});

definePageMeta({
	title: "pages.imprint.title",
});
</script>

<template>
	<MainContent class="mx-auto w-full max-w-container p-2">
		<div v-if="!isFetching" class="prose prose-sm md:prose-base">
			<h1>{{ t("pages.imprint.title") }}</h1>
			<ContentRendererMarkdown :value="imprintMd" />
		</div>
		<Centered v-else><Loader2 class="size-8 animate-spin" /></Centered>
	</MainContent>
</template>
