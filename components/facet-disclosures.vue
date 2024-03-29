<script setup lang="ts">
import type { SearchResponseFacetCountSchema } from "typesense/lib/Typesense/Documents";

import GenericDisclosure from "@/components/generic-disclosure.vue";
import { facetObjectToTypesenseQuery, getFacetObjectFromURL } from "@/lib/facets";
import type { AnyEntity } from "@/types/schema";

defineProps<{
	facets: Array<SearchResponseFacetCountSchema<AnyEntity>> | undefined;
	loading: boolean;
	collection: string;
	queryBy: Array<string> | string;
	defaultOpen?: boolean;
	filterBy: string;
}>();

const router = useRouter();
const route = useRoute();

const facetObject: Record<string, Array<string>> = getFacetObjectFromURL(true);

const facetChange = (facets: Array<string>, field: string) => {
	facetObject[field] = facets;

	void router.push({
		query: {
			...route.query,
			page: 1,
			facets: facetObjectToTypesenseQuery(facetObject),
		},
	});
};
</script>

<template>
	<GenericDisclosure title="Facets" :default-open="defaultOpen">
		<div class="p-2">
			<FacetField
				v-for="facet in facets"
				:key="facet.field_name"
				class="p-2"
				:field-name="String(facet.field_name)"
				:facets="facet.counts"
				:collection="collection"
				:selected="facetObject[facet.field_name] || []"
				:query-by="queryBy"
				:filter-by="filterBy"
				@facet-change="(model) => facetChange(model, facet.field_name)"
			/>
		</div>
	</GenericDisclosure>
</template>
