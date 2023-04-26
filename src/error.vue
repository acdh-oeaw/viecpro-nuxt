<script lang="ts" setup>
import MainContent from "@/components/main-content.vue";
import PageTitle from "@/components/page-title.vue";
import { clearError, definePageMeta, useI18n } from "#imports";
import { type Locale, type Schema } from "~/config/i18n.config";

definePageMeta({
	title: "pages.error.title",
});

defineProps<{
	error: Error;
}>();

function handleError() {
	clearError({ redirect: "/" });
}

const { t } = useI18n<Schema, Locale>();
</script>

<template>
	<MainContent class="h-full">
		<div class="mx-auto h-full w-full max-w-content px-4 py-2">
			<PageTitle>{{ t("pages.error.title") }}</PageTitle>
			<div class="grid h-full place-items-center">
				<button @click="handleError">{{ t("common.reset") }}</button>
			</div>
		</div>
	</MainContent>
</template>
