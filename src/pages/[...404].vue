<script lang="ts" setup>
definePageMeta({
	title: "NotFoundPage.meta.title",
});

const t = useTranslations("NotFoundPage");

useSeoMeta({
	robots: {
		nofollow: true,
		noindex: true,
	},
});
</script>

<template>
	<MainContent>
		<div class="container grid content-start gap-12 py-16">
			<h1>{{ t("title") }}</h1>
		</div>
	</MainContent>
</template>
