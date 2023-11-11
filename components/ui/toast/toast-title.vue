<script lang="ts" setup>
import { ToastTitle, type ToastTitleProps } from "radix-vue";

const props = defineProps<ToastTitleProps>();
</script>

<template>
	<ToastTitle v-bind="props" class="text-sm font-semibold">
		<slot />
	</ToastTitle>
</template>
