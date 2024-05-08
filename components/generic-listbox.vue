<script lang="ts" setup>
import {
	Listbox,
	ListboxButton,
	ListboxLabel,
	ListboxOption,
	ListboxOptions,
} from "@headlessui/vue";
import { ChevronsUpDown } from "lucide-vue-next";
import type { ModelRef } from "vue";

const model: ModelRef<{ label: string; value: string } | null> = defineModel({
	default: null,
});

defineProps<{
	items: Array<{ label: string; value: string }>;
	defaultLabel?: string;
	buttonClass?: string;
}>();
defineEmits(["change"]);
</script>

<template>
	<Listbox
		v-model="model"
		as="div"
		class="relative"
		@update:model-value="(to) => $emit('change', to)"
	>
		<div class="flex items-center gap-4">
			<ListboxLabel v-if="$slots.label">
				<slot name="label" />
			</ListboxLabel>
			<ListboxButton
				class="flex h-11 w-full items-center justify-between gap-2 rounded border bg-white p-2 shadow-lg"
				:class="buttonClass"
				as="button"
			>
				<span>{{ model?.label || model || defaultLabel }}</span>
				<ChevronsUpDown class="h-5 w-5 text-gray-500" />
			</ListboxButton>
		</div>
		<MenuTransition>
			<ListboxOptions
				v-if="items.length != 0"
				as="div"
				class="absolute z-10 mt-2 flex w-auto min-w-[-webkit-fill-available] flex-col divide-y rounded border bg-white shadow-xl"
			>
				<ListboxOption
					v-for="item in items"
					:key="item.value"
					class="cursor-pointer list-none p-2 first-of-type:rounded-t last-of-type:rounded-b ui-selected:bg-primary-300 ui-active:bg-primary-300"
					:value="item"
				>
					<span>{{ item.label }}</span>
				</ListboxOption>
			</ListboxOptions>
		</MenuTransition>
	</Listbox>
</template>
