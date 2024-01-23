<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ChevronUp } from "lucide-vue-next";
import type { SearchResponseFacetCountSchema } from "typesense/lib/Typesense/Documents";

import { facetObjectToTypesenseQuery, getFacetObjectFromURL } from "@/lib/facets";
import type { AnyEntity } from "@/types/schema";

const t = useTranslations();

defineProps<{
	facets: Array<SearchResponseFacetCountSchema<AnyEntity>> | undefined;
	loading: boolean;
	collection: string;
	queryBy: Array<string> | string;
	defaultOpen?: boolean;
}>();

const router = useRouter();
const route = useRoute();

const facetObject: Record<string, Array<string>> = getFacetObjectFromURL(true);

const facetChange = async (facets: Array<string>, field: string) => {
	facetObject[field] = facets;

	await router.push({
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
		<Transition
			enter-active-class="transition duration-100 ease-out"
			enter-from-class="transform scale-95 translate-x-8 opacity-0"
			enter-to-class="transform scale-100 translate-x-0 opacity-100"
			leave-active-class="transition duration-75 ease-out"
			leave-from-class="transform scale-100 translate-x-0 opacity-100"
			leave-to-class="transform scale-95 translate-x-8 opacity-0"
		>
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
		</Transition>
	</Disclosure>
</template>
