<script setup lang="ts">
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/vue";

defineProps<{
	cols: Array<string>;
	collection: string;
}>();

const route = useRoute();
const router = useRouter();

const t = useTranslations();
const sortedCol = computed({
	get() {
		if (route.query.sort) {
			return String(route.query.sort).split(":")[0];
		}
		return "";
	},
	set(to) {
		void router.push({
			query: {
				sort: to + ":asc",
			},
		});
	},
});
const direction = computed({
	get() {
		if (route.query.sort) {
			return String(route.query.sort).split(":")[1];
		}
		return "asc";
	},
	set(to) {
		void router.push({
			query: {
				sort: `${sortedCol.value}:${to}`,
			},
		});
	},
});
</script>

<template>
	<div v-if="cols.length" class="flex gap-2">
		<Listbox v-model="sortedCol" as="div" class="relative">
			<ListboxButton
				as="button"
				class="flex rounded border p-2 transition hover:bg-slate-200 active:bg-slate-300"
				>{{ sortedCol || "sortieren nach" }}</ListboxButton
			>
			<MenuTransition>
				<ListboxOptions
					class="absolute z-10 mt-1 overflow-auto rounded bg-white py-1 text-base shadow-lg ring-1"
				>
					<ListboxOption
						v-for="col in cols"
						:key="col"
						as="button"
						:value="col"
						class="w-full p-2 text-left transition hover:bg-slate-200 active:bg-slate-300"
					>
						{{ col }}
					</ListboxOption>
				</ListboxOptions>
			</MenuTransition>
		</Listbox>

		<Listbox v-model="direction" as="div" class="relative">
			<ListboxButton
				as="button"
				class="flex rounded border p-2 transition hover:bg-slate-200 active:bg-slate-300"
			>
				{{ direction }}
			</ListboxButton>
			<MenuTransition>
				<ListboxOptions>
					<ListboxOption value="asc"> Ascend </ListboxOption>
					<ListboxOption value="desc"> Descend </ListboxOption>
				</ListboxOptions>
			</MenuTransition>
		</Listbox>
		<GenericListbox
			:items="cols.map((col) => ({ value: col, label: t(`collection-keys.${collection}.${col}`) }))"
		/>
		<GenericListbox
			:items="[
				{ value: 'asc', label: t('collection-keys.generic.asc') },
				{ value: 'desc', label: t('collection-keys.generic.desc') },
			]"
		/>
	</div>
	<div v-else />
</template>
