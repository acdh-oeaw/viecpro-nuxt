<script lang="ts" setup>
import type { NavLinkProps } from "@/components/nav-link.vue";

const props = defineProps<{
	label: string;
	links: Record<string, { href: NavLinkProps["href"]; label: string }>;
}>();
</script>

<template>
	<nav :aria-label="props.label">
		<ul class="flex flex-wrap items-center gap-x-6 gap-y-3 font-medium text-white" role="list">
			<li v-for="(link, key) of props.links" :key="key">
				<NavLink class="opacity-80 transition hover:opacity-100" :href="link.href">
					{{ link.label }}
				</NavLink>
			</li>
		</ul>
	</nav>

	<div class="flex items-center gap-6">
		<LocaleSwitcher />
	</div>
</template>
