<script lang="ts" setup>
import { computed } from "vue";

import LocaleSwitch from "@/components/locale-switch.vue";
import { useI18n } from "@/composables/use-i18n";
import { type NavLink } from "@/lib/types";
import { NuxtLink } from "#components";
import { useLocalePath } from "#imports";

const { t } = useI18n();
const localePath = useLocalePath();

const links = computed(() => {
	return {
		home: { href: { path: localePath("/") }, label: t("pages.home.label") },
		search: { href: { path: localePath("/search/courts") }, label: t("pages.search.label") },
		documentation: {
			href: { path: localePath("/documentation/project") },
			label: t("pages.documentation.label"),
		},
	} satisfies Record<string, NavLink>;
});
</script>

<template>
	<header class="bg-primary-100 text-white">
		<div
			class="mx-auto flex w-full max-w-container flex-col items-center justify-between gap-x-4 gap-y-2 px-8 py-4 sm:flex-row"
		>
			<NuxtLink class="shrink-0" :href="links.home.href">
				<span class="sr-only">{{ links.home.label }}</span>
				<img alt="" class="h-20" src="@/assets/images/logo-white.png" />
			</NuxtLink>
			<div class="flex items-center">
				<nav :aria-label="t('common.main-navigation')">
					<ul class="flex flex-wrap gap-x-4" role="list">
						<li v-for="(link, key) of links" :key="key">
							<NuxtLink
								class="rounded p-2 transition hover:bg-primary-300 active:bg-primary-400"
								:href="link.href"
							>
								{{ link.label }}
							</NuxtLink>
						</li>
					</ul>
				</nav>
				<LocaleSwitch />
			</div>
		</div>
	</header>
</template>
