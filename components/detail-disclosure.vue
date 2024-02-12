<script lang="ts" setup>
import { get } from "lodash-es";
import { ChevronRight } from "lucide-vue-next";

import GenericDisclosure from "@/components/generic-disclosure.vue";
import { NuxtLink } from "#components";

defineProps<{
	rels: Array<object>;
	gridClass?: string;
	title: string;
	defaultOpen?: boolean;
	headers?: Array<string>;
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
					<span v-for="header in headers" :key="header" class="font-bold">
						{{ t(`collection-keys.${collectionName}["${header}"]`) }}
					</span>
				</div>
				<div v-for="hit in rels" :key="String(hit)" class="mt-1 border-t pt-1">
					<component
						:is="linkTo ? NuxtLink : 'div'"
						:to="`/${locale}/detail/${hit?.target?.model.toLowerCase() + 's'}/${
							hit?.target?.object_id
						}`"
						class="grid grid-cols-[1fr_auto] gap-1"
						:class="linkTo && 'rounded transition hover:bg-slate-200 active:bg-slate-300 p-1 -ml-1'"
					>
						<div class="grid gap-2" :class="gridClass">
							<span v-for="header in headers" :key="hit + header">{{ get(hit, header) }}</span>
						</div>
						<ChevronRight v-if="linkTo" class="h-5 w-5 shrink-0" />
					</component>
				</div>
			</div>
		</slot>
	</GenericDisclosure>
</template>
