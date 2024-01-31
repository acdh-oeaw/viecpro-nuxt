<script lang="ts" setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ChevronDown } from "lucide-vue-next";

defineProps<{
	disabled?: boolean;
	title: string;
	defaultOpen?: boolean;
}>();
</script>

<template>
	<Disclosure :default-open="defaultOpen && !disabled" as="div">
		<DisclosureButton
			as="button"
			class="flex w-full items-center justify-between rounded border-2 p-2 transition ui-open:rounded-b-none ui-open:border-primary-600 ui-open:bg-primary-500"
			:disabled="disabled"
			:class="
				disabled
					? 'opacity-50 cursor-not-allowed'
					: 'hover:border-primary-400 hover:bg-primary-300 border-primary-300 bg-primary-200 shadow-sm'
			"
		>
			<span class="ui-open:text-white">{{ title }}</span>
			<ChevronDown class="h-5 w-5 transition ui-open:-rotate-180" />
		</DisclosureButton>
		<DisclosurePanel
			v-if="!disabled"
			static
			as="div"
			class="box-border overflow-hidden rounded rounded-t-none border-2 p-2 transition-[max-height,border,padding] ui-open:max-h-screen ui-open:border-t-0 ui-not-open:max-h-0 ui-not-open:border-transparent ui-not-open:py-0"
		>
			<slot />
		</DisclosurePanel>
	</Disclosure>
</template>
