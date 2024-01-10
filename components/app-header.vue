<script lang="ts" setup>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { Menu as MenuIcon, X } from "lucide-vue-next";

import type { NavLink } from "@/lib/types";

const t = useTranslations();
const localePath = useLocalePath();

const links = computed(() => {
	return {
		home: { href: { path: localePath("/") }, label: t("pages.home.label") },
		search: { href: { path: localePath("/search/persons") }, label: t("pages.search.label") },
		documentation: {
			href: { path: localePath("/documentation/project") },
			label: t("pages.documentation.label"),
		},
	} satisfies Record<string, NavLink>;
});
</script>

<template>
	<header class="bg-primary-600 text-white">
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
								class="rounded p-2 transition hover:bg-primary-800 active:bg-primary-900"
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
				<Menu v-slot="{ open, close }" as="div" class="relative z-50 inline-block">
					<ClientOnly>
						<MenuButton as="button" class="rounded border border-gray-300 p-2">
							<X v-if="open" class="h-6 w-6 shrink-0" />
							<MenuIcon v-else class="h-6 w-6 shrink-0" />
						</MenuButton>
					</ClientOnly>
					<Transition
						enter-active-class="transition duration-100 ease-out"
						enter-from-class="transform scale-95 -translate-y-8 opacity-0"
						enter-to-class="transform scale-100 translate-y-0 opacity-100"
						leave-active-class="transition duration-75 ease-in"
						leave-from-class="transform scale-100 opacity-100"
						leave-to-class="transform scale-95 opacity-0"
					>
						<MenuItems
							as="div"
							class="absolute right-0 mt-1 flex w-56 flex-col divide-y rounded bg-gray-50 shadow-lg ring"
						>
							<MenuItem v-for="(link, key) of links" :key="key" class="flex" as="div">
								<NuxtLink
									class="w-full p-4 text-gray-900 transition first:rounded-t last:rounded-b hover:bg-gray-300 active:bg-gray-400"
									:href="link.href"
									@click="close"
								>
									{{ link.label }}
								</NuxtLink>
							</MenuItem>
							<MenuItem>
								<LocaleSwitch no-select />
							</MenuItem>
						</MenuItems>
					</Transition>
				</Menu>
			</div>
		</div>
	</header>
</template>
