<script lang="ts" setup>
import { ChevronDownIcon } from "lucide-vue-next";
import { SelectIcon, SelectTrigger, type SelectTriggerProps } from "radix-vue";

const props = defineProps<SelectTriggerProps & { invalid?: boolean }>();
</script>

<template>
	<SelectTrigger
		v-bind="props"
		:class="[
			'focus:ring-ring flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-on-muted focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
			{ '!ring-destructive placeholder:!text-destructive ring-2': props.invalid },
		]"
	>
		<slot />
		<SelectIcon as-child>
			<ChevronDownIcon class="h-4 w-4 opacity-50" />
		</SelectIcon>
	</SelectTrigger>
</template>
