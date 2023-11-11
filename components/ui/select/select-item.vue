<script lang="ts" setup>
import { CheckIcon } from "lucide-vue-next";
import { SelectItem, SelectItemIndicator, type SelectItemProps, SelectItemText } from "radix-vue";

const props = defineProps<SelectItemProps>();
</script>

<template>
	<SelectItem
		v-bind="props"
		class="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-on-accent data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
	>
		<span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
			<SelectItemIndicator>
				<CheckIcon class="h-4 w-4" />
			</SelectItemIndicator>
		</span>

		<SelectItemText>
			<slot />
		</SelectItemText>
	</SelectItem>
</template>
