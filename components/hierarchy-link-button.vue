<script setup lang="ts">
import { Network } from "lucide-vue-next";

defineProps<{
	model: string;
	id: string;
	label: string;
}>();
</script>

<template>
	<NuxtLink
		:to="{ path: 'hierarchy', query: { id, label, model } }"
		class="rounded-full transition hover:bg-slate-200 active:bg-slate-300"
	>
		<span class="sr-only">Go to Hierarchy view</span>
		<Network class="m-2 h-6 w-6 shrink-0" />
	</NuxtLink>
</template>
