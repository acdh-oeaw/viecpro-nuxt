<script lang="ts" setup>
import { ToastDescription, type ToastDescriptionProps } from "radix-vue";

const props = defineProps<ToastDescriptionProps>();
</script>

<template>
	<ToastDescription v-bind="props" class="line-clamp-3 text-sm opacity-90">
		<slot />
	</ToastDescription>
</template>
