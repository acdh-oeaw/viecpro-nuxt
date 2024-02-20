<script lang="ts" setup>
import { get } from "lodash-es";
import { ChevronRight } from "lucide-vue-next";

import GenericDisclosure from "@/components/generic-disclosure.vue";
import type { AnyEntity } from "@/types/schema";
import { NuxtLink } from "#components";

defineProps<{
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
</script>

<template>
	<GenericDisclosure
		:title="title"
		:disabled="rels.length === 0 && !customSlot"
		:default-open="defaultOpen"
	>
		<slot>
			<div class="p-2">
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
				<div v-for="hit in rels" :key="String(hit)" class="mt-1 border-t pt-1">
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
