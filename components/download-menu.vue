<script lang="ts" setup>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { Download, FileJson, X } from "lucide-vue-next";

import { downloadAsJson } from "@/lib/helpers";

defineProps<{
	data: object;
	collection: "viecpro_courts" | "viecpro_institutions" | "viecpro_persons" | "viecpro_places";
}>();
</script>

<template>
	<Menu v-slot="{ open }" as="div" class="relative z-40 inline-block">
		<ClientOnly>
			<MenuButton
				as="button"
				class="rounded-full p-2 transition hover:bg-slate-200 active:bg-slate-300"
			>
				<X v-if="open" class="h-6 w-6 shrink-0" />
				<Download v-else class="h-6 w-6 shrink-0" />
				<span class="sr-only">Open/Close Menu</span>
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
			<MenuItems
				as="div"
				class="absolute right-0 mt-1 flex gap-2 divide-y rounded border bg-gray-50 p-2 shadow-lg"
			>
				<MenuItem>
					<button
						class="rounded border shadow hover:bg-slate-200 active:bg-slate-300"
						@click="
							downloadAsJson(
								{ entity: data.entity.data, details: data.details.data },
								String(data.entity.data?.name),
							)
						"
					>
						<span class="sr-only">Download as .JSON</span>
						<FileJson class="m-2 h-6 w-6 shrink-0" />
					</button>
				</MenuItem>
				<MenuItem>
					<XlsxButton
						class="rounded border shadow hover:bg-slate-200 active:bg-slate-300"
						:data="data"
						:collection="collection"
					/>
				</MenuItem>
			</MenuItems>
		</Transition>
	</Menu>
</template>
