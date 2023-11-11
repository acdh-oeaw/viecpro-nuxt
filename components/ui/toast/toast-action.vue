<script lang="ts" setup>
import { ToastAction, type ToastActionProps } from "radix-vue";

const props = defineProps<ToastActionProps>();
</script>

<template>
	<ToastAction
		v-bind="props"
		class="focus:ring-ring inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[data-variant=negative]:border-muted/40 group-[data-variant=negative]:hover:border-negative/30 group-[data-variant=negative]:hover:bg-negative group-[data-variant=negative]:hover:text-on-negative group-[data-variant=negative]:focus:ring-negative"
	>
		<slot />
	</ToastAction>
</template>
