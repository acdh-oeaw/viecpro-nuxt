<script lang="ts" setup>
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/vue";
import { type Ref } from "vue";
import { ref, watchEffect } from "vue";

import { useI18n } from "@/composables/use-i18n";
import { type Locales } from "~/config/i18n.config";

const { locales, locale, setLocale } = useI18n();
const initialLocale: Locales = locales.value.filter((l: Locales) => {
	return l.code === locale.value;
})[0];
const selectedLocale: Ref<Locales> = ref(initialLocale);

watchEffect(() => {
	setLocale(selectedLocale.value.code);
});
</script>

<template>
	<div class="mx-4 rounded bg-white px-4 py-2 text-black">
		<Listbox v-model="selectedLocale">
			<ListboxButton>{{ selectedLocale.code }}</ListboxButton>

			<ListboxOptions class="fixed mt-4 -translate-x-4 rounded bg-white px-4 py-2 shadow-lg">
				<ListboxOption
					v-for="loc in locales"
					:key="loc.code"
					:value="loc"
					class="hover:cursor-pointer hover:text-primary-100"
				>
					{{ loc.code }}
				</ListboxOption>
			</ListboxOptions>
		</Listbox>
	</div>
</template>
