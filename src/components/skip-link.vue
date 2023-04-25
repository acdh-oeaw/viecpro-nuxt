<script lang="ts" setup>
import { NuxtLink } from "#components";
import { useI18n } from "#imports";
import { type Locale, type Schema } from "~/config/i18n.config";

const { t } = useI18n<Schema, Locale>();

const id = "main-content";
const hash = "#" + id;
</script>

<template>
	<NuxtLink
		class="fixed -translate-y-full rounded bg-white px-4 py-3 transition focus:translate-y-0"
		:href="{ hash }"
	>
		{{ t("common.skip-to-main-content") }}
	</NuxtLink>
</template>
