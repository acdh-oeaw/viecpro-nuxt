<script lang="ts" setup>
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/vue";
import { type Ref } from "vue";
import { ref, watchEffect } from "vue";

// TODO: GP: resolve these imports with correct typing, see also note in i18n.config
import { useI18n } from "@/composables/use-i18n";
import { type LocaleObject, locales } from "~/config/i18n.config";

const { locale, setLocale } = useI18n();
const selectedLocale: Ref<LocaleObject> = ref(locales[locale.value]);

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
					class="hover:cursor-pointer hover:text-primary-400 hover:underline"
				>
					{{ loc.code }}
				</ListboxOption>
			</ListboxOptions>
		</Listbox>
	</div>
</template>
