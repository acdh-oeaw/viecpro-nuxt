<script lang="ts" setup>
import { computed } from "vue";

import { useI18n } from "@/composables/use-i18n";
import { type NuxtLinkProps } from "#app";
import { NuxtLink } from "#components";
import { useLocalePath } from "#imports";

const { t } = useI18n();
const localePath = useLocalePath();

type NavLink = {
	href: NuxtLinkProps["href"];
	label: string;
};

const links = computed(() => {
	return {
		home: { href: { path: localePath("/") }, label: t("pages.home.label") },
		search: { href: { path: localePath("/search") }, label: t("pages.search.label") },
		documentation: {
			href: { path: localePath("/documentation") },
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

			<nav :aria-label="t('common.main-navigation')">
				<ul class="flex flex-wrap gap-x-4" role="list">
					<li v-for="(link, key) of links" :key="key">
						<NuxtLink :href="link.href">
							{{ link.label }}
						</NuxtLink>
					</li>
				</ul>
			</nav>
		</div>
	</header>
</template>
