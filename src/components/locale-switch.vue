<script lang="ts" setup>
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/vue";
import { computed } from "vue";

import { useI18n } from "@/composables/use-i18n";
import { locales } from "~/config/i18n.config";

const { locale, setLocale } = useI18n();

const selectedLocale = computed(() => {
	return locales[locale.value];
});

defineProps<{
	noSelect?: boolean;
}>();
</script>

<template>
	<div
		v-if="!noSelect"
		class="mx-4 rounded bg-white text-black transition hover:bg-slate-200 active:bg-slate-300"
	>
		<Listbox
			:model-value="selectedLocale"
			@update:model-value="(selectedValue) => setLocale(selectedValue.code)"
		>
			<ListboxButton class="px-4 py-2">{{ selectedLocale.code.toUpperCase() }}</ListboxButton>
			<Transition
				enter-active-class="transition duration-100 ease-out"
				enter-from-class="transform scale-95 -translate-y-8 opacity-0"
				enter-to-class="transform scale-100 translate-y-0 opacity-100"
				leave-active-class="transition duration-75 ease-in"
				leave-from-class="transform scale-100 opacity-100"
				leave-to-class="transform scale-95 opacity-0"
			>
				<ListboxOptions
					class="fixed ml-4 mt-4 flex -translate-x-4 flex-col rounded bg-white shadow-lg"
				>
					<ListboxOption
						v-for="loc in locales"
						:key="loc.code"
						as="button"
						:value="loc"
						class="min-w-[5rem] p-4 text-gray-900 transition first:rounded-t last:rounded-b hover:bg-gray-300 active:bg-gray-400"
					>
						{{ loc.code.toUpperCase() }}
					</ListboxOption>
				</ListboxOptions>
			</Transition>
		</Listbox>
	</div>
	<div v-else class="flex w-full divide-x">
		<button
			v-for="loc in locales"
			:key="loc.code"
			class="grow p-4 text-gray-900 transition hover:bg-gray-300 active:bg-gray-400"
			@click="setLocale(loc.code)"
		>
			{{ loc.code.toUpperCase() }}
		</button>
	</div>
</template>
