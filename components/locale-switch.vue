<script lang="ts" setup>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";

import { localesMap } from "@/config/i18n.config";

const { locale, setLocale } = useI18n();
</script>

<template>
	<div class="mx-4 rounded bg-white text-black transition hover:bg-slate-200 active:bg-slate-300">
		<Menu as="div">
			<ClientOnly>
				<MenuButton class="px-4 py-2" data-testid="localeButton" as="button">
					{{ locale.toUpperCase() }}
				</MenuButton>
			</ClientOnly>
			<MenuTransition>
				<MenuItems
					class="fixed z-50 ml-4 mt-4 flex -translate-x-4 flex-col rounded bg-white shadow-lg"
				>
					<MenuItem
						v-for="loc in localesMap"
						v-slot="{ active }"
						:key="loc.code"
						:data-testid="loc.code"
						@click="setLocale(loc.code)"
					>
						<button
							:class="active && 'bg-gray-400'"
							class="min-w-20 p-4 text-gray-900 transition first:rounded-t last:rounded-b hover:bg-gray-300"
						>
							{{ loc.code.toUpperCase() }}
						</button>
					</MenuItem>
				</MenuItems>
			</MenuTransition>
		</Menu>
	</div>
</template>
