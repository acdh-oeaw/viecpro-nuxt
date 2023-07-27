<script lang="ts" setup>
import MainContent from "@/components/main-content.vue";
import { useI18n } from "@/composables/use-i18n";
import { definePageMeta } from "#imports";

const { t } = useI18n();

definePageMeta({
	title: t("pages.search.title"),
});
</script>

<template>
	<MainContent>
		<div>Database Page</div>
	</MainContent>
</template>
