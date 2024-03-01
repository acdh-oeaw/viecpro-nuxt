<script lang="ts" setup>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
</script>

<template>
	<Menu as="div" class="relative z-40 inline-block h-10">
		<ClientOnly>
			<MenuButton as="template">
				<slot name="button" />
			</MenuButton>
		</ClientOnly>
		<Transition
			enter-active-class="transition duration-100 ease-out"
			enter-from-class="transform scale-95 -translate-y-8 opacity-0"
			enter-to-class="transform scale-100 translate-y-0 opacity-100"
			leave-active-class="transition duration-75 ease-in"
			leave-from-class="transform scale-100 opacity-100"
			leave-to-class="transform scale-95 opacity-0"
		>
			<MenuItems as="div" class="absolute right-0 rounded border bg-gray-50 p-2 shadow-lg">
				<MenuItem>
					<slot name="content" />
				</MenuItem>
			</MenuItems>
		</Transition>
	</Menu>
</template>
