<script lang="ts" setup>
import MainContent from "@/components/main-content.vue";
import PageTitle from "@/components/page-title.vue";
import { useI18n } from "@/lib/i18n/use-i18n";
import { ContentRenderer } from "#components";
import { definePageMeta, queryContent, useAsyncData } from "#imports";

definePageMeta({
	title: "pages.index.title",
});

const { locale, t } = useI18n();

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
