<script lang="ts" setup>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { Menu as MenuIcon, X } from "lucide-vue-next";
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
			class="mx-auto flex w-full max-w-container items-center justify-between gap-x-4 gap-y-2 px-8 py-4"
		>
			<NuxtLink class="shrink-0 select-none" :href="links.home.href">
				<span class="sr-only">{{ links.home.label }}</span>
				<img alt="" class="h-20" src="@/assets/images/logo-white.png" />
			</NuxtLink>
			<div class="hidden items-center md:flex">
				<nav :aria-label="t('common.main-navigation')">
					<ul class="flex flex-wrap gap-x-4" role="list">
						<li v-for="(link, key) of links" :key="key" class="select-none">
							<NuxtLink
								class="rounded p-2 transition hover:bg-primary-300 active:bg-primary-400"
								:href="link.href"
							>
								{{ link.label }}
							</NuxtLink>
						</li>
					</ul>
				</nav>
				<LocaleSwitch class="select-none" />
			</div>
			<div class="md:hidden">
				<Menu v-slot="{ open }" as="div" class="relative inline-block">
					<MenuButton as="button" class="rounded border border-gray-300 p-2">
						<X v-if="open" class="h-6 w-6 shrink-0" />
						<MenuIcon v-else class="h-6 w-6 shrink-0" />
					</MenuButton>
					<MenuItems
						as="div"
						class="absolute right-0 mt-1 flex w-56 flex-col divide-y rounded bg-gray-50 shadow-lg ring"
					>
						<MenuItem v-for="(link, key) of links" :key="key">
							<NuxtLink
								class="p-4 text-gray-900 transition first:rounded-t last:rounded-b hover:bg-gray-300 active:bg-gray-400"
								:href="link.href"
							>
								{{ link.label }}
							</NuxtLink>
						</MenuItem>
						<MenuItem>
							<LocaleSwitch no-select />
						</MenuItem>
					</MenuItems>
				</Menu>
			</div>
		</div>
	</header>
</template>
