<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { Loader2 } from "lucide-vue-next";

import { getImprint } from "@/lib/get-imprint";

defineRouteRules({
	prerender: true,
});

const t = useTranslations();
const { locale } = useI18n();

const { data: html, isFetching } = useQuery({
	queryKey: ["imprint", locale] as const,
	queryFn: async ({ queryKey }) => {
		const [, locale] = queryKey;
		const ret = await (await getImprint(locale)).text();
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
			<!-- eslint-disable-next-line vue/no-v-html -->
			<p v-if="html" v-html="html" />
		</div>
		<Centered v-else><Loader2 class="size-8 animate-spin" /></Centered>
	</MainContent>
</template>
