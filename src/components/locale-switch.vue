<script lang="ts" setup>
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/vue";
import { computed } from "vue";

import { useI18n } from "@/composables/use-i18n";
import { locales } from "~/config/i18n.config";

const { locale, setLocale } = useI18n();

const selectedLocale = computed(() => {
	return locales[locale.value];
});
</script>

<template>
	<div class="mx-4 rounded bg-white px-4 py-2 text-black">
		<Listbox
			:model-value="selectedLocale"
			@update:model-value="(selectedValue) => setLocale(selectedValue.code)"
		>
			<ListboxButton>{{ selectedLocale.code }}</ListboxButton>
			<ListboxOptions class="fixed mt-4 -translate-x-4 rounded bg-white px-4 py-2 shadow-lg">
				<ListboxOption
					v-for="loc in locales"
					:key="loc.code"
					:value="loc"
					class="hover:cursor-pointer hover:text-primary-400 hover:underline"
				>
					{{ loc.code }}
				</ListboxOption>
			</ListboxOptions>
		</Listbox>
	</div>
</template>
