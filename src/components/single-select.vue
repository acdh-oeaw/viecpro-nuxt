<script lang="ts" setup>
import {
	Listbox,
	ListboxButton,
	ListboxLabel,
	ListboxOption,
	ListboxOptions,
} from "@headlessui/vue";
import { keyByToMap } from "@stefanprobst/key-by";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-vue-next";
import { computed } from "vue";

interface Item {
	id: string;
	label: string;
	description?: string;
}

const props = defineProps<{
	ariaLabel?: string;
	items: Array<Item>;
	label?: string;
	name?: string;
	placeholder?: string;
	selectedKey?: Item["id"];
}>();

const emit = defineEmits<{
	(event: "change-selection", selectedKey: Item["id"]): void;
}>();

function onChangeSelection(selectedKey: Item["id"]) {
	emit("change-selection", selectedKey);
}

const itemsById = computed(() => {
	return keyByToMap(props.items, (item) => {
		return item.id;
	});
});

function getDisplayLabel(selectedKey: Item["id"]) {
	if (itemsById.value.has(selectedKey)) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const item = itemsById.value.get(selectedKey)!;

		return item.label;
	}

	return "Unknown";
}
</script>

<template>
	<Listbox
		as="div"
		class="relative"
		:model-value="props.selectedKey"
		:name="props.name"
		@update:model-value="onChangeSelection"
	>
		<div class="grid gap-y-1">
			<ListboxLabel v-if="props.label" class="text-xs font-medium text-neutral-600">
				{{ props.label }}
			</ListboxLabel>

			<ListboxButton
				:aria-label="props.ariaLabel"
				class="relative w-full cursor-default rounded-md border border-neutral-200 bg-white py-2 pl-3 pr-10 text-left text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-300"
			>
				<span v-if="props.selectedKey" class="block truncate">
					{{ getDisplayLabel(props.selectedKey) }}
				</span>
				<span v-else class="block truncate text-neutral-500">
					{{ props.placeholder ?? "Select a value" }}
				</span>
				<span
					class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-neutral-400"
				>
					<ChevronsUpDownIcon aria-hidden="true" class="h-5 w-5" />
				</span>
			</ListboxButton>
		</div>

		<Transition
			leave-active-class="transition duration-100 ease-in"
			leave-from-class="opacity-100"
			leave-to-class="opacity-0"
		>
			<ListboxOptions
				class="absolute z-50 mt-1 max-h-80 w-full overflow-auto rounded-md bg-white py-1 text-sm text-neutral-900 shadow-lg ring-1 ring-black/5 transition focus-visible:outline-none"
			>
				<ListboxOption
					v-for="item of props.items"
					v-slot="{ selected }"
					:key="item.id"
					:value="item.id"
					class="relative grid cursor-default select-none gap-1 py-2 pl-4 pr-10 ui-active:bg-neutral-100 ui-active:text-neutral-900"
				>
					<span class="block truncate ui-selected:font-medium">{{ item.label }}</span>
					<span v-if="item.description" class="block text-xs text-neutral-500">
						{{ item.description }}
					</span>
					<span
						v-if="selected"
						class="absolute inset-y-0 right-0 grid place-items-center pr-3 text-neutral-600"
					>
						<CheckIcon aria-hidden="true" class="h-5 w-5" />
					</span>
				</ListboxOption>
			</ListboxOptions>
		</Transition>
	</Listbox>
</template>
