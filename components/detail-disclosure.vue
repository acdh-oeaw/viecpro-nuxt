<script lang="ts" setup>
import { get } from "lodash-es";

import GenericDisclosure from "@/components/generic-disclosure.vue";

defineProps<{
	rels: Array<object>;
	gridClass?: string;
	title: string;
	defaultOpen?: boolean;
	headers?: Array<string>;
	customSlot?: boolean;
	collectionName: string;
}>();

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
				<div class="grid gap-2" :class="gridClass">
					<span v-for="header in headers" :key="header" class="font-bold">
						{{ t(`collection-keys.${collectionName}["${header}"]`) }}
					</span>
				</div>
				<div
					v-for="hit in rels"
					:key="String(hit)"
					class="mt-1 grid gap-2 border-t pt-1"
					:class="gridClass"
				>
					<span v-for="header in headers" :key="hit + header">{{ get(hit, header) }}</span>
				</div>
			</div>
		</slot>
	</GenericDisclosure>
</template>
