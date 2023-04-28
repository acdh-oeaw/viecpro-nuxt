<script lang="ts" setup>
import MainContent from "@/components/main-content.vue";
import PageTitle from "@/components/page-title.vue";
import { useI18n } from "@/lib/i18n/use-i18n";
import { clearError, definePageMeta } from "#imports";

definePageMeta({
	title: "pages.error.title",
});

defineProps<{
	error: Error;
}>();

function handleError() {
	clearError({ redirect: "/" });
}

const { t } = useI18n();
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
