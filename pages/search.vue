<script lang="ts" setup>
import { isEmpty } from "lodash-es";
import { ArrowLeftRight, CalendarRange, MapPin, School2, User, Users } from "lucide-vue-next";

import GenericDisclosure from "@/components/generic-disclosure.vue";
import RangeSlider from "@/components/range-slider.vue";
import { facetObjectToTypesenseQuery, typesenseQueryToFacetObject } from "@/lib/facets";
import type { NavLink } from "@/types/misc.d.ts";

const t = useTranslations();
const localePath = useLocalePath();

const route = useRoute();

const links = computed(() => {
	return {
		people: {
			href: { path: localePath("/search/persons") },
			label: t("pages.searchviews.people.label"),
			icon: User,
		},
		courts: {
			href: { path: localePath("/search/courts") },
			label: t("pages.searchviews.courts.label"),
			icon: Users,
		},
		institutions: {
			href: { path: localePath("/search/institutions") },
			label: t("pages.searchviews.institutions.label"),
			icon: School2,
		},
		events: {
			href: { path: localePath("/search/events") },
			label: t("pages.searchviews.events.label"),
			icon: CalendarRange,
		},
		places: {
			href: { path: localePath("/search/places") },
			label: t("pages.searchviews.places.label"),
			icon: MapPin,
		},
		relations: {
			href: { path: localePath("/search/relations") },
			label: t("pages.searchviews.relations.label"),
			icon: ArrowLeftRight,
		},
	} satisfies Record<string, NavLink>;
});

const updateFacets = async () => {
	const { query } = route;

	if (query.facets?.start_date_int) {
		await addToFacets(typesenseQueryToFacetObject(String(query.facets)).start_date_int);
	} else await addToFacets([1600, 1900]);
};

const addToFacets = async (range: [number, number]) => {
	const { query } = route;
	const router = useRouter();
	const facetObject = typesenseQueryToFacetObject(String(query.facets));

	if (range[0] === 1600 && range[1] === 1900) {
		delete facetObject.start_date_int;
		delete facetObject.end_date_int;

		if (isEmpty(facetObject)) {
			delete query.facets;
			await router.push({
				query,
			});
		} else {
			await router.push({
				query: {
					...query,
					facets: facetObjectToTypesenseQuery(facetObject, false, includeDateless.value),
				},
			});
		}
	} else {
		await router.push({
			query: {
				...query,
				facets: facetObjectToTypesenseQuery(
					{
						...facetObject,
						start_date_int: range,
						end_date_int: range,
					},
					false,
					includeDateless.value,
				),
			},
		});
	}
};

const queryRange = computed(() => {
	const { query } = route;

	const facetObject = typesenseQueryToFacetObject(String(query.facets));

	return facetObject.start_date_int as [number, number];
});

const includeDateless = ref(true);

const slider: Ref<[number, number]> = ref(queryRange.value.map(Number) as [number, number]);

definePageMeta({
	title: "pages.search.title",
});
</script>

<template>
	<MainContent>
		<div class="grid h-full grid-rows-[auto_1fr] gap-4 xl:grid-cols-[2fr_6fr]">
			<div class="flex flex-col gap-4">
				<div
					class="m-2 mx-auto flex h-fit max-w-fit flex-wrap lg:mx-4 xl:m-4 xl:max-w-sm xl:flex-col"
				>
					<NuxtLink
						v-for="link in links"
						:key="link.label"
						:to="link.href"
						class="group m-2 flex h-fit items-center gap-4 rounded border p-2 shadow transition hover:bg-slate-200 active:bg-slate-300 xl:mx-0"
						:class="$route.path === link.href.path && 'bg-slate-200'"
					>
						<component
							:is="link.icon"
							v-if="link.icon"
							class="transition group-hover:scale-110 group-active:scale-90"
						/>
						{{ link.label }}
					</NuxtLink>
				</div>
				<div class="mx-4 xl:max-w-sm">
					<ClientOnly>
						<GenericDisclosure :title="t('ui.timespan')" default-open>
							<div class="flex flex-col gap-1 p-2">
								<RangeSlider v-model="slider" :min="1600" :max="1900" :n-marker="7" class="p-1" />
								<div class="flex gap-1">
									<input
										id="dateCheck"
										v-model="includeDateless"
										type="checkbox"
										class="accent-primary-500"
										@change="updateFacets()"
									/>
									<label for="dateCheck" class="text-sm text-gray-600">
										Include Entities without date information
									</label>
								</div>
								<div class="mt-1 flex w-full justify-end">
									<NuxtLink
										class="rounded border p-2 transition hover:bg-slate-200 active:bg-slate-300"
										:to="{
											query: {
												...route.query,
												facets: facetObjectToTypesenseQuery(
													{
														...typesenseQueryToFacetObject(String(route.query.facets)),
														start_date_int: slider,
														end_date_int: slider,
													},
													false,
													includeDateless,
												),
											},
										}"
									>
										Go!
									</NuxtLink>
								</div>
							</div>
						</GenericDisclosure>
					</ClientOnly>
				</div>
			</div>
			<NuxtPage />
		</div>
	</MainContent>
</template>
