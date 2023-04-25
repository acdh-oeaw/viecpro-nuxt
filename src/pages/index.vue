<script lang="ts" setup>
import MainContent from "@/components/main-content.vue";
import PageTitle from "@/components/page-title.vue";
import { ContentRenderer } from "#components";
import { definePageMeta, queryContent, useAsyncData, useI18n } from "#imports";
import { type Locale, type Schema } from "~/config/i18n.config";

definePageMeta({
	title: "pages.index.title",
});

const { locale, t } = useI18n<Schema, Locale>();

const content = await useAsyncData("pages.index", () => {
	return queryContent("/").locale(locale.value).findOne();
});
</script>

<template>
	<MainContent>
		<img alt="" class="h-96 w-full object-cover" src="@/assets/images/hero.jpg" />
		<div class="mx-auto w-full max-w-content px-4 py-2">
			<PageTitle>{{ t("pages.index.title") }}</PageTitle>
			<ContentRenderer v-if="content.data.value" class="prose" :value="content.data.value" />
		</div>
	</MainContent>
</template>
