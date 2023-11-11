<script lang="ts" setup>
import { InfoIcon } from "lucide-vue-next";

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
			<InfoIcon v-if="useIcon" class="h-5 w-5" />
			<div
				class="text-base pointer-events-none absolute -top-10 left-0 w-max rounded-md bg-neutral-500 p-2 text-neutral-50 opacity-0 transition-opacity group-hover:opacity-100"
			>
				<span>
					{{ content }}
				</span>
			</div>
		</div>
	</div>
</template>
