<script lang="ts" setup>
import { Info } from "lucide-vue-next";

defineProps<{
	useIcon?: boolean;
	underline?: boolean;
	content: string;
}>();
</script>

<template>
	<div class="group relative inline-block cursor-pointer">
		<div class="flex items-center gap-2">
			<span class="border-dashed" :class="underline && 'border-b-2'">
				<slot />
			</span>
			<Info v-if="useIcon" class="h-5 w-5" />
			<div
				class="pointer-events-none absolute -top-10 left-0 w-max rounded bg-slate-500 p-2 text-base text-slate-50 opacity-0 transition-opacity group-hover:opacity-100"
			>
				<span>
					{{ content }}
				</span>
			</div>
		</div>
	</div>
</template>
