<script lang="ts" setup>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import type { UseQueryReturnType } from "@tanstack/vue-query";
import { Download, X } from "lucide-vue-next";
import type { SearchParams } from "typesense/lib/Typesense/Documents";

import type { AnyDetail, AnyEntity } from "@/types/schema";

interface DetailData {
	entity: UseQueryReturnType<AnyEntity, Error>;
	details: { data: AnyDetail };
}

defineProps<{
	data?: Array<AnyEntity> | DetailData;
	collection:
		| "viecpro_courts"
		| "viecpro_events"
		| "viecpro_institutions"
		| "viecpro_persons"
		| "viecpro_places"
		| "viecpro_references"
		| "viecpro_relations";
	detail?: boolean;
	all?: number;
	query?: SearchParams;
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
		<MenuTransition>
			<MenuItems
				as="div"
				class="absolute right-0 mt-1 flex gap-2 divide-y rounded border bg-gray-50 p-2 shadow-lg"
			>
				<MenuItem v-if="detail">
					<JsonDownloadButton
						v-if="detail"
						class="flex flex-col gap-1 rounded border p-2 pb-1 text-center shadow hover:bg-slate-200 active:bg-slate-300"
						:name="String((data as DetailData).entity.data.name)"
						:data="{
							entity: (data as DetailData).entity.data,
							details: (data as DetailData).details.data,
						}"
					>
						<span class="text-xs">.json</span>
					</JsonDownloadButton>
				</MenuItem>
				<MenuItem v-if="detail">
					<XlsxButtonDetail
						v-if="detail"
						class="flex flex-col gap-1 rounded border p-2 pb-1 text-center shadow hover:bg-slate-200 active:bg-slate-300"
						:data="data as DetailData"
						:collection="collection"
					>
						<span class="text-xs">.xlsx</span>
					</XlsxButtonDetail>
				</MenuItem>
				<MenuItem v-else-if="all && query">
					<DownloadResultsButtons :collection="collection" :all="all" :query="query" />
				</MenuItem>
			</MenuItems>
		</MenuTransition>
	</Menu>
</template>
