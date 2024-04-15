<script lang="ts" setup>
import { get } from "lodash-es";
import { ChevronRight, ChevronsUpDown } from "lucide-vue-next";

import GenericDisclosure from "@/components/generic-disclosure.vue";
import { NuxtLink } from "#components";

const props = defineProps<{
	rels: Array<object>;
	gridClass?: string;
	title: string;
	defaultOpen?: boolean;
	headers?: Array<string | [string, string]>;
	customSlot?: boolean;
	linkTo?: boolean;
	collectionName: string;
}>();

const localePath = useLocalePath();
const t = useTranslations();

const page = ref(0);
const limit = 25;
const all = props.rels.length;

const sortBy = ref("start_date");

const changeSort = (col: string) => {
	if (sortBy.value === col) sortBy.value = col + ":rev";
	else sortBy.value = col;
};

const currentRels = computed(() => {
	let retRels = [...props.rels];
	if (sortBy.value.includes(":rev")) {
		retRels = retRels.sort((a, b) =>
			String(a[sortBy.value.split(":")[0]]) < String(b[sortBy.value.split(":")[0]]) ? 1 : -1,
		);
	} else {
		retRels = retRels.sort((a, b) => (String(a[sortBy.value]) < String(b[sortBy.value]) ? -1 : 1));
	}
	return retRels.slice(page.value * limit, (page.value + 1) * limit);
});
</script>

<template>
	<GenericDisclosure
		:title="title"
		:disabled="rels.length === 0 && !customSlot"
		:default-open="defaultOpen"
	>
		<slot>
			<div class="p-2">
				<div v-if="all > limit" class="mb-4 flex justify-between">
					<button
						v-if="page > 1"
						class="rounded border p-1 transition hover:bg-slate-300 active:bg-slate-400"
						@click="page--"
					>
						<ChevronRight class="h-5 w-5 rotate-180" />
					</button>
					<div v-else class="flex items-center rounded border p-1 text-gray-300">
						<ChevronRight class="h-5 w-5 rotate-180" />
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
						class="rounded border p-1 transition hover:bg-slate-300 active:bg-slate-400"
						@click="page++"
					>
						<ChevronRight class="h-5 w-5" />
					</button>
					<div v-else class="flex items-center rounded border p-1 text-gray-300">
						<ChevronRight class="h-5 w-5" />
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
							<ChevronRight v-if="header === sortBy" class="h-4 w-4 rotate-90" />
							<ChevronRight v-else-if="header + ':rev' === sortBy" class="h-4 w-4 -rotate-90" />
							<ChevronsUpDown v-else class="h-4 w-4 text-gray-500" />
						</button>
					</template>
				</div>
				<div v-for="hit in currentRels" :key="String(hit)" class="mt-1 border-t pt-1">
					<component
						:is="linkTo ? NuxtLink : 'div'"
						:to="
							localePath(
								`/detail/${hit?.target?.model.toLowerCase() + 's'}/${hit?.target?.object_id}`,
							)
						"
						class="grid grid-cols-[1fr_auto] items-center gap-1"
						:class="linkTo && 'rounded transition hover:bg-slate-200 active:bg-slate-300 p-1 -ml-1'"
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
						<ChevronRight v-if="linkTo" class="h-5 w-5 shrink-0" />
					</component>
				</div>
			</div>
		</slot>
	</GenericDisclosure>
</template>
