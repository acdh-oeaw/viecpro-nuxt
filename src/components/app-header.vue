<script lang="ts" setup>
import { computed } from "vue";

import LanguageToggle from "@/components/language-toggle.vue";
import { useI18n } from "@/lib/i18n/use-i18n";
import { NuxtLink } from "#components";
import { useLocalePath } from "#imports";

const { t } = useI18n();
const localePath = useLocalePath();

const links = computed(() => {
	return {
		home: { href: localePath({ path: "/" }), label: t("pages.index.title") },
		search: { href: localePath({ path: "/search/persons" }), label: t("pages.search.title") },
	};
});
</script>

<template>
	<header class="bg-primary-100 text-white">
		<div class="mx-auto flex w-full max-w-container items-center justify-between gap-4 px-4 py-2">
			<NuxtLink :aria-label="links.home.label" :href="links.home.href">
				<img alt="" class="h-16" src="@/assets/images/logo-white.png" />
			</NuxtLink>

			<div class="flex items-center gap-4">
				<nav :aria-label="t('common.main-navigation')">
					<ul class="flex items-center gap-4" role="list">
						<li v-for="(link, key) of links" :key="key">
							<NuxtLink class="aria-[current]:underline" :href="link.href">
								{{ link.label }}
							</NuxtLink>
						</li>
					</ul>
				</nav>

				<LanguageToggle />
			</div>
		</div>
	</header>
</template>
