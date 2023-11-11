<script lang="ts" setup>
import type { NavLinkProps } from "@/components/nav-link.vue";

const t = useTranslations();

const links = computed(() => {
	return {
		imprint: { href: { path: "/imprint" }, label: t("AppFooter.links.imprint") },
	} satisfies Record<string, { href: NavLinkProps["href"]; label: string }>;
});

const logos = {
	ihb: "/assets/images/logo-ihb.svg",
	acdh: "/assets/images/logo-acdh-with-text.svg",
	oeaw: "/assets/images/logo-oeaw.svg",
	fwf: "/assets/images/logo-fwf.svg",
};
</script>

<template>
	<footer class="border-t text-sm">
		<div class="grid container grid-cols-2 py-8">
			<div>
				<div>Institute for Habsburg and Balkan Studies (IHB)</div>
				<div>Austrian Academy of Sciences</div>
				<div>Hollandstrasse 11-13</div>
				<div>1020 Wien</div>
			</div>
			<div>
				<div>Austrian Centre for Digital Humanities and Cultural Heritage</div>
				<div>Austrian Academy of Sciences</div>
				<div>Bäckerstrasse 13</div>
				<div>1010 Wien</div>
			</div>
		</div>
		<div class="grid container grid-cols-4 items-center gap-16">
			<div v-for="(src, key) of logos" :key="key">
				<a class="flex items-center justify-center" :href="t(`AppFooter.logos.${key}.href`)">
					<span class="sr-only">{{ t(`AppFooter.logos.${key}.label`) }}</span>
					<img alt="" class="max-h-12 object-contain" :src="src" />
				</a>
			</div>
		</div>
		<div class="container flex items-center justify-center gap-4 py-8">
			<nav :aria-label="t('AppFooter.navigation-secondary')">
				<ul class="flex items-center gap-4" role="list">
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
