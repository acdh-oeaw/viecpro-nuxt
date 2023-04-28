<script lang="ts" setup>
import { request } from "@stefanprobst/request";

import MainContent from "@/components/main-content.vue";
import PageTitle from "@/components/page-title.vue";
import { useI18n } from "@/lib/i18n/use-i18n";
import { definePageMeta, useAsyncData } from "#imports";
import { createImprintUrl } from "~/config/imprint.config";

definePageMeta({
	title: "pages.imprint.title",
});

const { locale, t } = useI18n();

const imprint = await useAsyncData("pages.imprint", () => {
	const url = createImprintUrl(locale.value);

	return request(url, { responseType: "text" });
});
</script>

<template>
	<MainContent>
		<div class="mx-auto w-full max-w-content px-4 py-2">
			<PageTitle>{{ t("pages.imprint.title") }}</PageTitle>
			<!-- eslint-disable-next-line vue/no-v-html -->
			<div class="prose" v-html="imprint.data.value" />
		</div>
	</MainContent>
</template>
