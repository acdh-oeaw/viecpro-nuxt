<script lang="ts" setup>
import { MenuIcon } from "lucide-vue-next";

import type { NavLinkProps } from "@/components/nav-link.vue";

const props = defineProps<{
	links: Record<string, { href: NavLinkProps["href"]; label: string }>;
	title: string;
}>();

const isSidepanelOpen = ref(false);

function close() {
	isSidepanelOpen.value = false;
}

onMounted(() => {
	window.addEventListener("resize", close, { passive: true });
});

onScopeDispose(() => {
	window.removeEventListener("resize", close);
});
</script>

<template>
	<Sheet v-model:open="isSidepanelOpen">
		<SheetTrigger aria-label="Toggle navigation menu" class="cursor-default">
			<MenuIcon class="mx-3 my-1.5 h-5 w-5" />
		</SheetTrigger>
		<SheetContent class="overflow-y-auto">
			<SheetTitle class="sr-only">{{ props.title }}</SheetTitle>
			<ul class="grid py-8" role="list">
				<li v-for="(link, key) of props.links" :key="key">
					<NavLink class="flex py-2 font-medium" :href="link.href" @click="close">
						{{ link.label }}
					</NavLink>
				</li>
			</ul>

			<div class="grid gap-2">
				<LocaleSwitcher />
			</div>
		</SheetContent>
	</Sheet>
</template>
