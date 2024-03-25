<script lang="ts" setup>
import { NuxtLink } from "#components";

defineProps<{
	link?: boolean;
}>();

const path = useRoute().fullPath;
const router = useRouter();

let host: string;
if (process.client) {
	host = window.location.host;
}
</script>

<template>
	<component
		:is="link ? NuxtLink : 'span'"
		:class="link && 'underline'"
		:to="router.currentRoute.value.fullPath"
	>
		{{ host }}{{ path }}
	</component>
</template>
