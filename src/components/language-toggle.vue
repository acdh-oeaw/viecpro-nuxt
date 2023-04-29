<script lang="ts" setup>
import SingleSelect from "@/components/single-select.vue";
import { useI18n } from "@/lib/i18n/use-i18n";
import { type Locale, locales } from "~/config/i18n.config";

const { locale, setLocale, t } = useI18n();

function onChangeLanguage(locale: string) {
	setLocale(locale as Locale);
}

const languages = Object.values(locales).map((locale) => {
	return { id: locale.code, label: locale.name };
});
</script>

<template>
	<SingleSelect
		:aria-label="t('common.switch-language')"
		:items="languages"
		:selected-key="locale"
		@change-selection="onChangeLanguage"
	/>
</template>
