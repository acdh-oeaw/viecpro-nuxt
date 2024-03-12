<script lang="ts" setup>
import {
	Combobox,
	ComboboxButton,
	ComboboxInput,
	ComboboxOption,
	ComboboxOptions,
} from "@headlessui/vue";
import { useQuery } from "@tanstack/vue-query";
import { Search } from "lucide-vue-next";
import type { ModelRef } from "vue";

import type { HierarchyNode } from "@/lib/types";

const query = ref(
	useQuery({
		queryKey: ["autocomplete"],
		queryFn: async () => {
			const data = await fetch(
				"https://viecpro.acdh-dev.oeaw.ac.at/visualisations/entityautocomplete/",
			);
			const ret = await data.json();

			return ret.context as Array<HierarchyNode>;
		},
	}),
);

const selection: ModelRef<HierarchyNode | null> = defineModel({
	default: null,
});
const input = ref("");

const filtered = computed(() => {
	if (!query.value.data) return null;
	return input.value === ""
		? query.value.data
		: query.value.data.filter((entity) => {
				return entity.label.toLowerCase().includes(input.value.toLowerCase());
			});
});

defineEmits(["change", "input"]);
</script>

<template>
	<Combobox
		v-model="selection"
		as="div"
		class="relative"
		@update:model-value="$emit('change', selection)"
	>
		<div
			v-if="!query.isFetching"
			class="relative m-2 cursor-default overflow-hidden rounded border bg-white text-left shadow-lg"
		>
			<ComboboxInput
				class="w-96 p-2"
				:display-value="(entity) => (entity as HierarchyNode)?.label"
				@change="
					input = $event.target.value;
					$emit('input', $event.target.value);
				"
			/>
			<ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
				<Search class="h-5 w-5" />
			</ComboboxButton>
		</div>
		<div v-else class="m-2 h-11 w-96 animate-pulse rounded bg-gray-300 shadow-lg"></div>
		<MenuTransition>
			<ComboboxOptions
				v-if="filtered"
				as="div"
				class="absolute ml-2 flex flex-col divide-y overflow-auto rounded border bg-white text-base shadow"
			>
				<ComboboxOption
					v-for="entity in filtered.slice(0, 10)"
					:key="entity.pk"
					:value="entity"
					as="div"
					class="cursor-pointer p-2 ui-active:bg-primary-300"
				>
					{{ entity.label }}
				</ComboboxOption>
			</ComboboxOptions>
		</MenuTransition>
	</Combobox>
</template>
