<script lang="ts" setup>
import { ChevronDown } from "lucide-vue-next";
import {
	AccordionContent,
	AccordionHeader,
	AccordionItem,
	AccordionRoot,
	AccordionTrigger,
} from "radix-vue";

defineProps<{
	disabled?: boolean;
	title: string;
	defaultOpen?: boolean;
}>();
</script>

<template>
	<AccordionRoot
		type="single"
		collapsible
		:default-value="String(!disabled && defaultOpen && title)"
	>
		<AccordionItem :value="title">
			<AccordionHeader>
				<AccordionTrigger
					as="button"
					class="group flex w-full items-center justify-between rounded border-2 p-2 transition data-[state=open]:rounded-b-none data-[state=open]:border-primary-600 data-[state=open]:bg-primary-500 data-[state=open]:text-white ui-open:rounded-b-none ui-open:border-primary-600 ui-open:bg-primary-500 ui-open:text-white"
					:disabled="disabled"
					:class="
						disabled
							? 'opacity-50'
							: 'hover:border-primary-400 hover:bg-primary-300 border-primary-300 bg-primary-200 shadow-sm'
					"
				>
					<span>{{ title }}</span>
					<ChevronDown class="h-5 w-5 transition group-data-[state=open]:rotate-180" />
				</AccordionTrigger>
			</AccordionHeader>
			<AccordionContent
				static
				as="div"
				class="overflow-hidden rounded rounded-t-none border-2 border-t-0 data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown"
			>
				<slot />
			</AccordionContent>
		</AccordionItem>
	</AccordionRoot>
</template>
