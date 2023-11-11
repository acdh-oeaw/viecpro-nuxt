<script lang="ts" setup>
import { ToastProvider, type ToastProviderProps, ToastViewport } from "radix-vue";

const props = defineProps<ToastProviderProps>();
</script>

<template>
	<ToastProvider v-bind="props">
		<slot />

		<ToastViewport
			class="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]"
			:class="$attrs.class"
		/>
	</ToastProvider>
</template>
