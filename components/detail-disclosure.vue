<script lang="ts" setup>
import { get } from "lodash-es";
import { ChevronRight } from "lucide-vue-next";

import GenericDisclosure from "@/components/generic-disclosure.vue";
import type { AnyEntity } from "@/types/schema";
import { NuxtLink } from "#components";

const props = defineProps<{
	rels: Array<AnyEntity>;
	gridClass?: string;
	title: string;
	defaultOpen?: boolean;
	headers?: Array<string | [string, string]>;
	customSlot?: boolean;
	linkTo?: boolean;
	collectionName: string;
}>();

const locale = useLocale();
const t = useTranslations();

const page = ref(0);
const limit = 25;
const all = props.rels.length;
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
					<template v-for="header in headers" :key="header">
						<span v-if="typeof header === 'string'">
							{{ t(`collection-keys.${collectionName}["${header}"]`) }}
						</span>
						<span v-else class="font-bold">
							{{ t(`collection-keys.${collectionName}["${header[0]}"]`) }}
						</span>
					</template>
				</div>
				<div
					v-for="hit in rels.slice(page * limit, (page + 1) * limit)"
					:key="String(hit)"
					class="mt-1 border-t pt-1"
				>
					<component
						:is="linkTo ? NuxtLink : 'div'"
						:to="`/${locale}/detail/${hit?.target?.model.toLowerCase() + 's'}/${
							hit?.target?.object_id
						}`"
						class="grid grid-cols-[1fr_auto] items-center gap-1"
						:class="linkTo && 'rounded transition hover:bg-slate-200 active:bg-slate-300 p-1 -ml-1'"
					>
						<div class="grid items-center gap-2" :class="gridClass">
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
