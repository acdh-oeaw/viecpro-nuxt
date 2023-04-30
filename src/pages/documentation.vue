<script lang="ts" setup>
import MainContent from "@/components/main-content.vue";
import PageTitle from "@/components/page-title.vue";
import { useI18n } from "@/lib/i18n/use-i18n";
import { definePageMeta } from "#imports";

definePageMeta({
	title: "pages.documentation.title",
});

const { t } = useI18n();
</script>

<template>
	<MainContent>
		<div class="mx-auto w-full max-w-content px-4 py-2">
			<PageTitle>{{ t("pages.documentation.title") }}</PageTitle>
		</div>
	</MainContent>
</template>
