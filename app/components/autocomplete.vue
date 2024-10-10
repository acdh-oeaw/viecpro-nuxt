<script lang="ts" setup>
import {
	Combobox,
	ComboboxButton,
	ComboboxInput,
	ComboboxOption,
	ComboboxOptions,
} from "@headlessui/vue";
import { useQuery } from "@tanstack/vue-query";
import { ChevronsUpDown, Loader2 } from "lucide-vue-next";

import type { HierarchyNode } from "@/lib/types";

const t = useTranslations();

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

const selection = defineModel<HierarchyNode | null>({
	default: null,
});
const input = ref("");

const filtered = computed(() => {
	if (!query.value.data) return [];

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
		class="relative w-full md:w-auto"
		@update:model-value="$emit('change', selection)"
	>
		<div
			class="relative m-2 flex cursor-default overflow-hidden rounded border bg-white text-left shadow-lg"
		>
			<ComboboxInput
				class="w-full truncate p-2 md:w-72"
				:display-value="(entity) => (entity as HierarchyNode)?.label"
				@change="
					$emit('input', $event.target.value);
					input = $event.target.value;
				"
			/>
			<ComboboxButton class="inset-y-0 right-0 flex items-center px-3 text-gray-500">
				<ChevronsUpDown class="size-5" />
				<span class="sr-only">{{ t("ui.search-placeholder") }}</span>
			</ComboboxButton>
		</div>
		<MenuTransition>
			<ComboboxOptions
				as="div"
				class="absolute z-10 ml-2 flex w-full flex-col divide-y overflow-auto rounded border bg-white text-base shadow"
			>
				<template v-if="!query.isFetching">
					<ComboboxOption
						v-for="entity in filtered.slice(0, 10)"
						:key="entity.pk"
						as="div"
						class="cursor-pointer p-2 ui-active:bg-primary-300"
						:value="entity"
					>
						{{ entity.label }}
					</ComboboxOption>
				</template>
				<div v-else class="h-48">
					<Centered>
						<Loader2 class="size-5 shrink-0 animate-spin" />
					</Centered>
				</div>
			</ComboboxOptions>
		</MenuTransition>
	</Combobox>
</template>
