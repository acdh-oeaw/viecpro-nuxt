<script lang="ts" setup>
import { NuxtLink } from "#components";

defineProps<{
	link?: boolean;
}>();

const path = useRoute().fullPath;

let host: string;
if (process.client) {
	host = window.location.host;
}
</script>

<template>
	<component :is="link ? NuxtLink : 'span'" :class="link && 'underline'" :to="host + path">
		{{ host }}{{ path }}
	</component>
</template>
