<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ChevronUp } from "lucide-vue-next";
import { type SearchResponseFacetCountSchema } from "typesense/lib/Typesense/Documents";

import FacetField from "@/components/facet-field.vue";

defineProps<{
	facets: Array<SearchResponseFacetCountSchema<Record<string, Document>>> | undefined;
	loading: boolean;
	collection: string;
	queryBy: string;
}>();
</script>

<template>
	<Disclosure v-slot="{ open }" as="div" class="flex flex-col md:pt-2" default-open>
		<DisclosureButton
			class="flex items-center justify-end gap-2 rounded align-top text-xl transition hover:bg-slate-200 active:bg-slate-300 lg:justify-center"
		>
			{{ open ? "Hide" : "Show" }} Filters...
			<ChevronUp class="h-5 w-5 rotate-180 ui-open:rotate-0" />
		</DisclosureButton>
		<DisclosurePanel
			v-if="!loading && facets !== undefined"
			as="div"
			class="flex flex-col gap-2 divide-y"
		>
			<FacetField
				v-for="facet in facets"
				:key="facet.field_name"
				class="pt-2"
				:field-name="String(facet.field_name)"
				:facets="facet.counts"
				:collection="collection"
				:query-by="queryBy"
			/>
		</DisclosurePanel>
	</Disclosure>
</template>
