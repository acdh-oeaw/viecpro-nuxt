<script lang="ts" setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import get from "lodash.get";
import { ChevronDown } from "lucide-vue-next";
import { type SearchResponseHit } from "typesense/lib/Typesense/Documents";

import { type Relation } from "@/lib/schema.types";

defineProps<{
	rels: Array<SearchResponseHit<Relation>>;
	title: string;
	defaultOpen?: boolean;
	headers?: {
		[index: string]: string;
	};
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
			class="box-border grid grid-cols-4 gap-2 overflow-hidden rounded rounded-t-none p-2 transition-[height_padding] ui-open:max-h-screen ui-open:border-2 ui-open:border-t-0 ui-not-open:max-h-0 ui-not-open:p-0"
		>
			<span v-for="header in Object.keys(headers)" :key="header" class="font-bold">
				{{ header }}
			</span>
			<template v-for="hit in rels" :key="hit.document.id">
				<div class="col-span-4 border-t first-of-type:border-t-2" />
				<span v-for="col in Object.values(headers)" :key="col">{{ get(hit, col) }}</span>
			</template>
		</DisclosurePanel>
	</Disclosure>
</template>
