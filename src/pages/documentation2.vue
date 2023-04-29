<script lang="ts" setup>
import MainContent from "@/components/main-content.vue";
import { ContentDoc } from "#components";
import { definePageMeta } from "#imports";

definePageMeta({
	title: "pages.documentation.title",
});
</script>

<template>
	<MainContent>
		<div>About Page</div>
		<ContentDoc></ContentDoc>
	</MainContent>
</template>
