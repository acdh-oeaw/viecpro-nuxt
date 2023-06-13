<script lang="ts" setup>
import { type NavLinkProps } from "@/components/nav-link.vue";

const t = useTranslations("AppHeader");

const links = {
	home: { href: { path: "/" }, label: t("links.home") },
	search: { href: { path: "/search" }, label: t("links.search") },
	documentation: { href: { path: "/documentation" }, label: t("links.documentation") },
} satisfies Record<string, { href: NavLinkProps["href"]; label: string }>;
</script>

<template>
	<header class="border-b-8 border-primary-background py-8">
		<div class="container flex items-center justify-between gap-4">
			<nav :aria-label="t('navigation-main')">
				<ul class="flex flex-wrap items-center gap-4" role="list">
					<li v-for="(link, key) of links" :key="key">
						<NavLink :href="link.href">
							{{ link.label }}
						</NavLink>
					</li>
				</ul>
			</nav>

			<LocaleSwitcher />
		</div>
	</header>
</template>
