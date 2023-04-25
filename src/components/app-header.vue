<script lang="ts" setup>
import { computed } from "vue";

import LanguageToggle from "@/components/language-toggle.vue";
import { NuxtLink } from "#components";
import { useI18n, useLocalePath } from "#imports";
import { type Locale, type Schema } from "~/config/i18n.config";

const { t } = useI18n<Schema, Locale>();
const localePath = useLocalePath();

const links = computed(() => {
	return {
		home: { href: localePath({ path: "/" }), label: t("pages.index.title") },
		search: { href: localePath({ path: "/search/persons" }), label: t("pages.search.title") },
	};
});
</script>

<template>
	<header class="bg-primary-100 text-white">
		<div class="mx-auto flex w-full max-w-container items-center justify-between gap-4 px-4 py-2">
			<NuxtLink :aria-label="t('pages.index.title')" :href="localePath({ path: '/' })">
				<img alt="" class="h-16" src="@/assets/images/logo-white.png" />
			</NuxtLink>

			<div class="flex items-center gap-4">
				<nav :aria-label="t('common.main')">
					<ul class="flex items-center gap-4" role="list">
						<li v-for="(link, key) of links" :key="key">
							<NuxtLink :href="link.href">{{ link.label }}</NuxtLink>
						</li>
					</ul>
				</nav>

				<LanguageToggle />
			</div>
		</div>
	</header>
</template>
