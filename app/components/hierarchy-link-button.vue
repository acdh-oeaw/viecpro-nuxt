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
		class="rounded-full transition hover:bg-slate-200 active:bg-slate-300"
		:to="{ path: 'hierarchy', query: { id, label, model } }"
	>
		<span class="sr-only">Go to Hierarchy view</span>
		<Network class="m-2 size-6 shrink-0" />
	</NuxtLink>
</template>
