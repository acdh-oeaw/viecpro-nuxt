<script lang="ts" setup>
import MainContent from "@/components/main-content.vue";
import PageTitle from "@/components/page-title.vue";
import { definePageMeta, useI18n } from "#imports";
import { type Locale, type Schema } from "~/config/i18n.config";

definePageMeta({
	title: "pages.imprint.title",
});

const { t } = useI18n<Schema, Locale>();
</script>

<template>
	<MainContent>
		<div class="mx-auto w-full max-w-content px-4 py-2">
			<PageTitle>{{ t("pages.imprint.title") }}</PageTitle>
		</div>
	</MainContent>
</template>
