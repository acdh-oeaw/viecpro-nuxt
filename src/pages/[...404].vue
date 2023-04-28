<script lang="ts" setup>
import MainContent from "@/components/main-content.vue";
import PageTitle from "@/components/page-title.vue";
import { useI18n } from "@/lib/i18n/use-i18n";
import { definePageMeta, useHead } from "#imports";

definePageMeta({
	title: "pages.page-not-found.title",
});

const { t } = useI18n();

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
