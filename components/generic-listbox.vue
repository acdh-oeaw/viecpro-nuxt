<script lang="ts" setup>
import {
	Listbox,
	ListboxButton,
	ListboxLabel,
	ListboxOption,
	ListboxOptions,
} from "@headlessui/vue";
import { Float } from "@headlessui-float/vue";
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
	<!-- eslint-disable tailwindcss/no-contradicting-classname -->
	<Listbox
		v-model="model"
		as="div"
		class="relative"
		@update:model-value="(to) => $emit('change', to)"
	>
		<Float portal as="div" class="relative">
			<div class="flex w-full items-center gap-4">
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
					class="absolute z-10 mt-2 flex w-max min-w-full flex-col divide-y rounded border bg-white shadow-xl"
					:class="$slots.label && 'ml-10'"
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
		</Float>
	</Listbox>
</template>
