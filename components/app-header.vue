<script lang="ts" setup>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { Menu as MenuIcon, X } from "lucide-vue-next";

const t = useTranslations();

const links = computed(() => {
	return {
		home: { href: { path: "/" }, label: t("pages.home.label") },
		search: { href: { path: "/search/persons" }, label: t("pages.search.label") },
		hierarchy: { href: { path: "/hierarchy" }, label: t("pages.hierarchy.label") },
		documentation: {
			href: { path: "/documentation/project" },
			label: t("pages.documentation.label"),
		},
	};
});

defineProps<{ compact?: boolean }>();
</script>

<template>
	<header class="bg-primary-600 text-white">
		<div class="mx-auto flex w-full max-w-container items-center justify-between gap-2 px-8 py-4">
			<NuxtLink class="shrink-0 select-none" :href="links.home.href">
				<span class="sr-only">{{ links.home.label }}</span>
				<img alt="" :class="compact ? 'h-12' : 'h-20'" src="/assets/images/logo-white.png" />
			</NuxtLink>
			<div class="hidden items-center md:flex">
				<nav :aria-label="t('common.main-navigation')">
					<ul class="flex flex-wrap justify-end gap-3" role="list">
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
			</div>
			<div class="md:hidden">
				<Menu v-slot="{ open, close }" as="div" class="relative z-50 inline-block">
					<MenuButton as="button" class="rounded border border-gray-300 p-2">
						<X v-if="open" class="h-6 w-6 shrink-0" />
						<MenuIcon v-else class="h-6 w-6 shrink-0" />
						<span class="sr-only">Open/Close Menu</span>
					</MenuButton>
					<MenuTransition>
						<MenuItems
							as="div"
							class="absolute right-0 z-50 mt-1 grid w-56 grid-cols-2 divide-y rounded bg-gray-50 shadow-lg ring"
							@click="close"
						>
							<MenuItem
								v-for="(link, key) of links"
								:key="key"
								v-slot="{ active }"
								class="col-span-2 flex"
							>
								<NuxtLink
									class="w-full p-4 text-gray-900 transition first:rounded-t last:rounded-b hover:bg-gray-300"
									:class="active && 'bg-gray-400'"
									:href="link.href"
								>
									{{ link.label }}
								</NuxtLink>
							</MenuItem>
						</MenuItems>
					</MenuTransition>
				</Menu>
			</div>
		</div>
	</header>
</template>
