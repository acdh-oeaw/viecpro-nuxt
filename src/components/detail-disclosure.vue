<script lang="ts" setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ChevronDown } from "lucide-vue-next";
import { type SearchResponseHit } from "typesense/lib/Typesense/Documents";

import { type Relation } from "@/lib/schema.types";
import { useLocalePath } from "#imports";

const localePath = useLocalePath();
defineProps<{
	rels: Array<SearchResponseHit<Relation>>;
	title: string;
	defaultOpen?: boolean;
}>();
</script>

<template>
	<Disclosure :default-open="defaultOpen && rels.length != 0" as="div">
		<DisclosureButton
			as="button"
			class="flex w-full items-center justify-between rounded border-2 p-2 transition ui-open:rounded-b-none ui-open:border-primary-400 ui-open:bg-primary-300"
			:disabled="rels.length === 0"
			:class="
				rels.length === 0
					? 'opacity-50 cursor-not-allowed'
					: 'hover:border-primary-200 hover:bg-primary-100'
			"
		>
			<span>{{ title }}</span>
			<ChevronDown class="h-5 w-5 transition ui-open:-rotate-180" />
		</DisclosureButton>
		<DisclosurePanel
			v-if="rels.length !== 0"
			static
			as="div"
			class="box-border grid grid-cols-4 gap-2 overflow-hidden rounded rounded-t-none p-2 transition-[height_padding] ui-open:max-h-screen ui-open:border-2 ui-open:border-t-0 ui-not-open:max-h-0 ui-not-open:p-0"
		>
			<span class="font-bold">Bezeichnung</span>
			<span class="font-bold">Institution</span>
			<span class="font-bold">Von</span>
			<span class="font-bold">Bis</span>
			<template v-for="hit in rels" :key="hit.document.id">
				<div class="col-span-4 border-t first-of-type:border-t-2" />
				<span>{{ hit.document.relation_type }}</span>
				<NuxtLink
					class="font-semibold hover:underline"
					:to="localePath('/detail/institutions/' + hit.document.target.object_id)"
				>
					<span>{{ hit.document.target.name }}</span>
				</NuxtLink>
				<span>{{ hit.document.start_date }}</span>
				<span>{{ hit.document.end_date }}</span>
			</template>
		</DisclosurePanel>
	</Disclosure>
</template>
