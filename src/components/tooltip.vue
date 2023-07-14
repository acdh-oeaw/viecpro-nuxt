<script lang="ts" setup>
import { ChevronDownIcon, InformationCircleIcon } from "@heroicons/vue/24/outline";

defineProps<{
	useIcon: boolean;
	content: string;
}>();
</script>

<template>
	<div class="group relative inline-block cursor-pointer">
		<div class="flex items-center gap-2">
			<span>
				<slot />
			</span>
			<InformationCircleIcon v-if="useIcon" class="h-5 w-5" />
			<div
				class="absolute top-[-210%] z-10 flex h-fit min-w-full flex-col rounded border bg-slate-100 p-2 text-center opacity-0 transition group-hover:opacity-100"
			>
				<span>
					{{ content }}
				</span>
				<ChevronDownIcon class="mx-auto h-5 w-5" />
			</div>
		</div>
	</div>
</template>
