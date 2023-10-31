<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ChevronUp } from "lucide-vue-next";
import { type SearchResponseFacetCountSchema } from "typesense/lib/Typesense/Documents";
import { useRoute, useRouter } from "vue-router";

import FacetField from "@/components/facet-field.vue";
import { useI18n } from "@/composables/use-i18n";
import { facetObjectToTypesenseQuery, getFacetObjectFromURL } from "@/lib/facets";

const { t } = useI18n();

defineProps<{
	facets: Array<SearchResponseFacetCountSchema<Record<string, Document>>> | undefined;
	loading: boolean;
	collection: string;
	queryBy: string;
	defaultOpen?: boolean;
}>();
const router = useRouter();
const route = useRoute();

const facetObject: { [key: string]: Array<string> } = getFacetObjectFromURL(true);

const facetChange = (facets: Array<string>, field: string) => {
	facetObject[field] = facets;

	router.push({
		query: {
			...route.query,
			page: 1,
			facets: facetObjectToTypesenseQuery(facetObject),
		},
	});
};
</script>

<template>
	<Disclosure v-slot="{ open }" as="div" class="flex flex-col md:pt-2" :default-open="defaultOpen">
		<DisclosureButton
			class="flex items-center justify-end gap-2 rounded align-top text-xl transition hover:bg-slate-200 active:bg-slate-300 lg:justify-center"
		>
			{{ open ? t("ui.hide-filters") : t("ui.show-filters") }}
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
				:selected="facetObject[facet.field_name] || []"
				:query-by="queryBy"
				@facet-change="(model) => facetChange(model, facet.field_name)"
			/>
		</DisclosurePanel>
	</Disclosure>
</template>
