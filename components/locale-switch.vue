<script lang="ts" setup>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";

import { locales } from "@/config/i18n.config";

const { locale, setLocale } = useI18n();

defineProps<{
	noSelect?: boolean;
}>();
</script>

<template>
	<div
		v-if="!noSelect"
		class="mx-4 rounded bg-white text-black transition hover:bg-slate-200 active:bg-slate-300"
	>
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
						v-for="loc in locales"
						v-slot="{ active }"
						:key="loc.code"
						:data-testid="loc.code"
						@click="setLocale(loc.code)"
					>
						<button
							:class="active && 'bg-gray-400'"
							class="min-w-[5rem] p-4 text-gray-900 transition first:rounded-t last:rounded-b hover:bg-gray-300"
						>
							{{ loc.code.toUpperCase() }}
						</button>
					</MenuItem>
				</MenuItems>
			</MenuTransition>
		</Menu>
	</div>
	<div v-else class="flex w-full divide-x">
		<button
			v-for="loc in locales"
			:key="loc.code"
			class="grow p-4 text-gray-900 transition hover:bg-gray-300 focus:bg-red-50 active:bg-gray-400"
			:data-testid="loc.code"
			@click="setLocale(loc.code)"
		>
			{{ loc.code.toUpperCase() }}
		</button>
	</div>
</template>
