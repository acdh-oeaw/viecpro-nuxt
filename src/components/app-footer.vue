<script lang="ts" setup>
import { type NavLinkProps } from "@/components/nav-link.vue";

const t = useTranslations("AppFooter");

const links = {
	imprint: { href: { path: "/imprint" }, label: t("links.imprint") },
} satisfies Record<string, { href: NavLinkProps["href"]; label: string }>;
</script>

<template>
	<footer class="py-8">
		<div class="container flex items-center justify-between gap-4">
			<nav :aria-label="t('navigation-secondary')">
				<ul class="flex flex-wrap items-center gap-4" role="list">
					<li v-for="(link, key) of links" :key="key">
						<NavLink :href="link.href">
							{{ link.label }}
						</NavLink>
					</li>
				</ul>
			</nav>
		</div>
	</footer>
</template>
