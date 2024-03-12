<script lang="ts" setup>
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/vue";
import { ChevronsUpDown } from "lucide-vue-next";
import type { ModelRef } from "vue";

const model: ModelRef<string | null> = defineModel({
	default: null,
});

defineProps<{
	items: Array<string>;
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
		<ListboxButton
			class="m-2 flex h-11 min-w-24 items-center justify-between gap-2 rounded border bg-white p-2 shadow-lg"
			as="button"
		>
			<span>{{ model }}</span>
			<ChevronsUpDown class="h-5 w-5 text-gray-500" />
		</ListboxButton>
		<MenuTransition>
			<ListboxOptions
				as="div"
				class="absolute ml-2 flex w-full flex-col divide-y rounded border bg-white shadow-xl"
			>
				<ListboxOption v-for="item in items" :key="item" class="list-none p-2" :value="item">
					<span>{{ item }}</span>
				</ListboxOption>
			</ListboxOptions>
		</MenuTransition>
	</Listbox>
</template>
