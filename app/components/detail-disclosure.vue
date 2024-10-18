<script lang="ts" setup>
import { get } from "lodash-es";
import { ChevronRight, ChevronsUpDown } from "lucide-vue-next";

import GenericDisclosure from "@/components/generic-disclosure.vue";
import { NuxtLink } from "#components";

const props = defineProps<{
	rels: Array<{ start_date_iso: number; end_date_iso: number }>;
	gridClass?: string;
	title: string;
	defaultOpen?: boolean;
	headers?: Array<string>;
	customSlot?: boolean;
	linkTo?: boolean;
	collectionName: string;
}>();

const t = useTranslations();

const page = ref(0);
const limit = 25;
const all = props.rels.length;

const sortBy = ref("start_date");

const changeSort = (col: string) => {
	if (sortBy.value === col) sortBy.value = `${col}:rev`;
	else sortBy.value = col;
};

const currentRels = computed(() => {
	const retRels = [...props.rels];
	const adjValue = sortBy.value.replace(/((?:start|end)_date)/g, "$1_iso");
	if (adjValue.includes(":rev")) {
		retRels.sort((a, b) => {
			const key = adjValue.split(":")[0] as "start_date_iso" | "end_date_iso";
			return a[key] < b[key] ? 1 : -1;
		});
	} else {
		retRels.sort((a, b) => {
			const key = adjValue as "start_date_iso" | "end_date_iso";
			return a[key] < b[key] ? -1 : 1;
		});
	}
	return retRels.slice(page.value * limit, (page.value + 1) * limit);
});
</script>

<template>
	<GenericDisclosure
		class="overflow-hidden"
		:default-open="defaultOpen"
		:disabled="rels.length === 0 && !customSlot"
		:title="title"
	>
		<slot>
			<div class="p-2">
				<GenericListbox
					v-if="headers && all <= limit"
					button-class="shadow-none"
					class="mb-2 w-fit"
					:default-label="t('ui.sort-by-short')"
					:items="
						headers.map((header) => ({
							value: header,
							label: t(`collection-keys.${collectionName}.${header}`),
						}))
					"
					@change="(to) => changeSort(to.value)"
				/>
				<div v-if="all > limit" class="mb-4 grid grid-cols-[1fr_auto_1fr]">
					<div class="flex items-center gap-2">
						<button
							v-if="page > 0"
							class="h-full rounded border p-1 transition hover:bg-slate-300 active:bg-slate-400"
							@click="page--"
						>
							<ChevronRight class="h-full w-5 rotate-180" />
						</button>
						<div v-else class="flex h-full items-center rounded border p-1 text-gray-300">
							<ChevronRight class="h-full w-5 rotate-180" />
						</div>

						<GenericListbox
							v-if="headers"
							button-class="shadow-none h-full"
							:default-label="t('ui.sort-by-short')"
							:items="
								headers.map((header) => ({
									value: header,
									label: t(`collection-keys.${collectionName}.${header}`),
								}))
							"
							@change="(to) => changeSort(to.value)"
						/>
					</div>
					<div>
						<div class="flex flex-wrap justify-center gap-1">
							<button v-if="page > 2" class="underline" @click="page = 0">1</button>

							<span v-if="page > 3">...</span>
							<template v-for="n in 5" :key="n - 2 + page">
								<button
									v-if="n - 2 + page >= 1 && n - 2 + page <= Math.ceil(all / limit)"
									:class="n === 3 ? 'font-semibold' : 'underline'"
									@click="page = n - 3 + page"
								>
									{{ n - 2 + page }}
								</button>
							</template>
							<span v-if="page + 4 < Math.ceil(all / limit)">...</span>
							<button
								v-if="page + 3 < Math.ceil(all / limit)"
								class="underline"
								@click="page = Math.ceil(all / limit) - 1"
							>
								{{ Math.ceil(all / limit) }}
							</button>
						</div>
						<div class="text-center">
							{{ page * limit + 1 }} - {{ Math.min((page + 1) * limit, all) }} / {{ all }}
						</div>
					</div>
					<button
						v-if="page < Math.ceil(all / limit) - 1"
						class="w-fit justify-self-end rounded border p-1 transition hover:bg-slate-300 active:bg-slate-400"
						@click="page++"
					>
						<ChevronRight class="size-5" />
					</button>
					<div v-else class="flex items-center justify-self-end rounded border p-1 text-gray-300">
						<ChevronRight class="size-5" />
					</div>
				</div>
				<div class="grid gap-2" :class="linkTo ? 'mr-6 ' + gridClass : gridClass">
					<template v-for="header in headers" :key="String(header)">
						<button
							class="-m-0.5 -mx-1 flex items-center gap-2 rounded p-0.5 px-1 transition hover:bg-slate-200 active:bg-slate-300"
							@click="typeof header === 'string' ? changeSort(header) : changeSort(header[0])"
						>
							<button v-if="typeof header === 'string'" class="text-left">
								{{ t(`collection-keys.${collectionName}.${header}`) }}
							</button>
							<button v-else class="text-left font-bold">
								{{ t(`collection-keys.${collectionName}.${header[0]}`) }}
							</button>
							<ChevronRight v-if="header === sortBy" class="size-4 rotate-90" />
							<ChevronRight v-else-if="header + ':rev' === sortBy" class="size-4 -rotate-90" />
							<ChevronsUpDown v-else class="size-4 text-gray-500" />
						</button>
					</template>
				</div>
				<div v-for="hit in currentRels" :key="String(hit)" class="mt-1 border-t pt-1">
					<component
						:is="linkTo ? NuxtLink : 'div'"
						class="grid grid-cols-[1fr_auto] items-center gap-1"
						:class="linkTo && 'rounded transition hover:bg-slate-200 active:bg-slate-300 p-1 -ml-1'"
						:to="`/detail/${hit?.target?.model.toLowerCase() + 's'}/${hit?.target?.object_id}`"
					>
						<div class="grid items-center gap-2 hyphens-auto" :class="gridClass">
							<template v-for="header in headers" :key="hit + header">
								<span v-if="typeof header === 'string'">
									{{ get(hit, header) }}
								</span>
								<span v-else>
									{{ get(hit, header[0]) || get(hit, header[1]) }}
								</span>
							</template>
						</div>
						<ChevronRight v-if="linkTo" class="size-5 shrink-0" />
					</component>
				</div>
			</div>
		</slot>
	</GenericDisclosure>
</template>
