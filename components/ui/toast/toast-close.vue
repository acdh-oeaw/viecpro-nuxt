<script lang="ts" setup>
import { XIcon } from "lucide-vue-next";
import { ToastClose, type ToastCloseProps } from "radix-vue";

const props = defineProps<ToastCloseProps>();
</script>

<template>
	<ToastClose
		v-bind="props"
		class="group-[data-variant=negative]:text-red-300 group-[data-variant=negative]:hover:text-red-50 group-[data-variant=negative]:focus-visible:ring-red-400 group-[data-variant=negative]:focus-visible:ring-offset-red-600 absolute right-2 top-2 rounded-md p-1 text-on-background/50 opacity-0 transition hover:text-on-background focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 group-hover:opacity-100"
	>
		<XIcon class-name="h-4 w-4" />
	</ToastClose>
</template>
