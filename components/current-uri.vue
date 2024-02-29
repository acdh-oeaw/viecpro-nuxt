<script lang="ts" setup>
import { NuxtLink } from "#components";

defineProps<{
	link?: boolean;
}>();

const path = useRoute().fullPath;

const prefix = process.env.NODE_ENV !== "production" ? "http://" : "https://";

let host: string;
if (process.client) {
	host = window.location.host;
}
</script>

<template>
	<component :is="link ? NuxtLink : 'span'" :class="link && 'underline'" :to="prefix + host + path">
		{{ host }}{{ path }}
	</component>
</template>
