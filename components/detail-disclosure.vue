<script lang="ts" setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { get } from "lodash";
import { ChevronDown } from "lucide-vue-next";

defineProps<{
	rels: Array<object>;
	gridClass?: string;
	title: string;
	defaultOpen?: boolean;
	headers?: Array<string>;
	customSlot?: boolean;
	collectionName: string;
}>();

const t = useTranslations();
</script>

<template>
	<Disclosure :default-open="defaultOpen && (rels.length != 0 || customSlot)" as="div">
		<DisclosureButton
			as="button"
			class="flex w-full items-center justify-between rounded border-2 p-2 transition ui-open:rounded-b-none ui-open:border-primary-600 ui-open:bg-primary-500"
			:disabled="rels.length === 0 && !customSlot"
			:class="
				rels.length === 0 && !customSlot
					? 'opacity-50 cursor-not-allowed'
					: 'hover:border-primary-400 hover:bg-primary-300 border-primary-300 bg-primary-200 shadow-sm'
			"
		>
			<span class="ui-open:text-white">{{ title }}</span>
			<ChevronDown class="h-5 w-5 transition ui-open:-rotate-180" />
		</DisclosureButton>
		<DisclosurePanel
			v-if="(rels.length !== 0 && headers) || customSlot"
			static
			as="div"
			class="box-border overflow-hidden rounded rounded-t-none border-2 p-2 transition-[max-height,border,padding] ui-open:max-h-screen ui-open:border-t-0 ui-not-open:max-h-0 ui-not-open:border-transparent ui-not-open:py-0"
		>
			<slot>
				<div class="grid gap-2" :class="gridClass">
					<span v-for="header in headers" :key="header" class="font-bold">
						{{ t(`collection-keys.${collectionName}["${header}"]`) }}
					</span>
				</div>
				<div
					v-for="hit in rels"
					:key="String(hit)"
					class="mt-1 grid gap-2 border-t pt-1"
					:class="gridClass"
				>
					<span v-for="header in headers" :key="hit + header">{{ get(hit, header) }}</span>
				</div>
			</slot>
		</DisclosurePanel>
	</Disclosure>
</template>
