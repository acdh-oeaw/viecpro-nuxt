<script lang="ts" setup>
import {
	Listbox,
	ListboxButton,
	ListboxLabel,
	ListboxOption,
	ListboxOptions,
} from "@headlessui/vue";

import { useI18n } from "#imports";
import { type Locale, locales, type Schema } from "~/config/i18n.config";

const { locale, setLocale, t } = useI18n<Schema, Locale>();

function onChangeLanguage(locale: Locale) {
	setLocale(locale);
}
</script>

<template>
	<Listbox :model-value="locale" @update:model-value="onChangeLanguage">
		<ListboxLabel>{{ t("common.switch-language") }}</ListboxLabel>
		<ListboxButton>{{ locale }}</ListboxButton>
		<ListboxOptions>
			<ListboxOption v-for="language of locales" :key="language.code" :value="language.code">
				{{ language.name }}
			</ListboxOption>
		</ListboxOptions>
	</Listbox>
</template>
