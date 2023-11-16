<script lang="ts" setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ChevronDown } from "lucide-vue-next";

defineProps<{
	rels: Array<object>;
	gridClass?: string;
	title: string;
	defaultOpen?: boolean;
	headers?: Array<string>;
}>();
</script>

<template>
	<Disclosure :default-open="defaultOpen && rels.length != 0" as="div">
		<DisclosureButton
			as="button"
			class="flex w-full items-center justify-between rounded border-2 p-2 transition ui-open:rounded-b-none ui-open:border-primary-400 ui-open:bg-primary-300"
			:disabled="rels.length === 0"
			:class="
				rels.length === 0
					? 'opacity-50 cursor-not-allowed'
					: 'hover:border-primary-200 hover:bg-primary-100 shadow-sm'
			"
		>
			<span>{{ title }}</span>
			<ChevronDown class="h-5 w-5 transition ui-open:-rotate-180" />
		</DisclosureButton>
		<DisclosurePanel
			v-if="rels.length !== 0 && headers"
			static
			as="div"
			class="box-border overflow-hidden rounded rounded-t-none p-2 transition-[height_padding] ui-open:max-h-screen ui-open:border-2 ui-open:border-t-0 ui-not-open:max-h-0 ui-not-open:p-0"
		>
			<div class="grid gap-2" :class="gridClass">
				<span v-for="header in headers" :key="header" class="font-bold">
					{{ header }}
				</span>
			</div>
			<div
				v-for="hit in rels"
				:key="String(hit)"
				class="mt-1 grid gap-2 border-t pt-1"
				:class="gridClass"
			>
				<span v-for="val in Object.values(hit)" :key="val">{{ val }}</span>
			</div>
		</DisclosurePanel>
	</Disclosure>
</template>
