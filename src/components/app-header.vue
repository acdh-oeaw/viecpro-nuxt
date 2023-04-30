<script lang="ts" setup>
import { computed } from "vue";

import ClientLink from "@/components/client-link.vue";
import LanguageToggle from "@/components/language-toggle.vue";
import { useI18n } from "@/lib/i18n/use-i18n";

const { t } = useI18n();

const links = computed(() => {
	return {
		home: { href: { path: "/" }, label: t("pages.index.title") },
		search: { href: { path: "/search/persons" }, label: t("pages.search.title") },
	};
});
</script>

<template>
	<header class="bg-primary-100 text-white">
		<div
			class="mx-auto flex w-full max-w-container flex-wrap items-center justify-between gap-4 px-4 py-2"
		>
			<ClientLink :aria-label="links.home.label" class="shrink-0" :href="links.home.href">
				<img alt="" class="h-16" src="@/assets/images/logo-white.png" />
			</ClientLink>

			<div class="flex items-center gap-4">
				<nav :aria-label="t('common.main-navigation')">
					<ul class="flex items-center gap-4" role="list">
						<li v-for="(link, key) of links" :key="key">
							<ClientLink
								class="aria-[current]:underline aria-[current]:underline-offset-2"
								:href="link.href"
							>
								{{ link.label }}
							</ClientLink>
						</li>
					</ul>
				</nav>

				<LanguageToggle class="min-w-[8rem]" />
			</div>
		</div>
	</header>
</template>
