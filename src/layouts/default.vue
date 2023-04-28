<script lang="ts" setup>
import AppFooter from "@/components/app-footer.vue";
import AppHeader from "@/components/app-header.vue";
import SkipLink from "@/components/skip-link.vue";
</script>

<template>
	<div class="grid min-h-full grid-rows-[auto_1fr_auto]">
		<SkipLink />
		<AppHeader />
		<slot />
		<AppFooter />
	</div>
</template>
