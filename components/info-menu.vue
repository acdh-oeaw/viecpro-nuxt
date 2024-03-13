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
		<MenuTransition>
			<MenuItems as="div" class="absolute right-0 rounded border bg-gray-50 p-2 shadow-lg">
				<MenuItem>
					<slot name="content" />
				</MenuItem>
			</MenuItems>
		</MenuTransition>
	</Menu>
</template>
