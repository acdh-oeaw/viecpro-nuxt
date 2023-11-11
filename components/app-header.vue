<script lang="ts" setup>
import type { NavLinkProps } from "@/components/nav-link.vue";

const t = useTranslations();

const links = computed(() => {
	return {
		home: { href: { path: "/" }, label: t("AppHeader.links.home") },
		search: { href: { path: "/search" }, label: t("AppHeader.links.search") },
		documentation: {
			href: { path: "/documentation" },
			label: t("AppHeader.links.documentation"),
		},
	} satisfies Record<string, { href: NavLinkProps["href"]; label: string }>;
});
</script>

<template>
	<header class="bg-brand-600 text-white">
		<div class="container flex items-center justify-between gap-6 py-6">
			<NavLink class="flex shrink-0" :href="links.home.href">
				<span class="sr-only">{{ links.home.label }}</span>
				<img alt="" class="block h-16" height="64" src="/assets/images/logo-light.png" />
			</NavLink>

			<div class="hidden lg:flex lg:flex-1 lg:items-center lg:justify-between lg:gap-6">
				<AppNavigationMenu :label="t('AppHeader.navigation-main')" :links="links" />
			</div>

			<nav :aria-label="t('AppHeader.navigation-main')" class="flex shrink-0 lg:hidden">
				<AppNavigationMenuMobile :links="links" :title="t('AppHeader.navigation-menu')" />
			</nav>
		</div>
	</header>
</template>
