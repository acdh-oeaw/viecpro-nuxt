<script lang="ts" setup>
const t = useTranslations();

const id = "main-content";
const hash = "#" + id;
</script>

<template>
	<NuxtLink
		class="fixed translate-y-[-120%] rounded bg-white px-4 py-3 text-black focus:translate-y-0"
		:href="{ hash }"
	>
		{{ t("common.skip-to-main-content") }}
	</NuxtLink>
</template>
