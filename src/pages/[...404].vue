<script lang="ts" setup>
import MainContent from "@/components/main-content.vue";
import PageTitle from "@/components/page-title.vue";
import { definePageMeta, useHead, useI18n } from "#imports";
import { type Locale, type Schema } from "~/config/i18n.config";

definePageMeta({
	title: "pages.page-not-found.title",
});

const { t } = useI18n<Schema, Locale>();

useHead({
	meta: [{ name: "robots", content: "noindex" }],
});
</script>

<template>
	<MainContent>
		<div class="mx-auto w-full max-w-container px-4 py-2">
			<PageTitle>{{ t("pages.page-not-found.title") }}</PageTitle>
		</div>
	</MainContent>
</template>
