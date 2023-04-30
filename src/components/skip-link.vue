<script lang="ts" setup>
import { useI18n } from "@/lib/i18n/use-i18n";
import { NuxtLink } from "#components";

const { t } = useI18n();

const id = "main-content";
const hash = "#" + id;

/**
 * @see https://bugzilla.mozilla.org/show_bug.cgi?id=308064
 */
function onClick() {
	const element = document.getElementById(id);
	element?.focus();
}
</script>

<template>
	<NuxtLink
		class="fixed -translate-y-full rounded bg-white px-4 py-3 transition focus:translate-y-0"
		:href="{ hash }"
		@click="onClick"
	>
		{{ t("common.skip-to-main-content") }}
	</NuxtLink>
</template>
