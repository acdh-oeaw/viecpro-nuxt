<script lang="ts" setup>
import { isEmpty } from "lodash-es";
import {
	BookTextIcon,
	CalendarRange,
	CalendarSearch,
	MapPin,
	MedalIcon,
	School2,
	User,
	Users,
} from "lucide-vue-next";

import GenericDisclosure from "@/components/generic-disclosure.vue";
import RangeSlider from "@/components/range-slider.vue";
import { facetObjectToTypesenseQuery, typesenseQueryToFacetObject } from "@/lib/facets";

const t = useTranslations();

const route = useRoute();

usePageMetadata({
	title: t("pages.search.title"),
});

const links = computed(() => {
	return {
		people: {
			href: { path: "/search/persons" },
			label: t("pages.searchviews.people.label"),
			icon: User,
		},
		courts: {
			href: { path: "/search/courts" },
			label: t("pages.searchviews.courts.label"),
			icon: Users,
		},
		institutions: {
			href: { path: "/search/institutions" },
			label: t("pages.searchviews.institutions.label"),
			icon: School2,
		},
		places: {
			href: { path: "/search/places" },
			label: t("pages.searchviews.places.label"),
			icon: MapPin,
		},
	};
});

const inactiveLinks = computed(() => {
	return {
		events: {
			// href: { path: ("/search/events") },
			label: t("pages.searchviews.events.label"),
			icon: CalendarRange,
		},
		bibliography: {
			label: t("pages.searchviews.bibliography.label"),
			icon: BookTextIcon,
		},
		register: {
			label: t("pages.searchviews.register.label"),
			icon: MedalIcon,
		},
	};
});

const updateFacets = () => {
	const { query } = route;

	if (query.facets?.start_date_int) {
		addToFacets(typesenseQueryToFacetObject(String(query.facets)).start_date_int);
	} else addToFacets([1600, 1900]);
};

const addToFacets = (range: [number, number]) => {
	const { query } = route;
	const router = useRouter();
	const facetObject = typesenseQueryToFacetObject(String(query.facets));

	if (range[0] === 1600 && range[1] === 1900) {
		delete facetObject.start_date_int;
		delete facetObject.end_date_int;

		if (isEmpty(facetObject)) {
			delete query.facets;
			void router.push({
				query,
			});
		} else {
			void router.push({
				query: {
					...query,
					facets: facetObjectToTypesenseQuery(facetObject, false, includeDateless.value),
				},
			});
		}
	} else {
		void router.push({
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

	return (facetObject.start_date_int ?? [1600, 1900]) as [number, number];
});

const includeDateless = ref(true);

// FIXME:
// eslint-disable-next-line regexp/no-super-linear-backtracking
if (route.query.facets && /\[\d+..\d+\]/.test(String(route.query.facets))) {
	includeDateless.value = false;
}

const slider: Ref<[number, number]> = ref(queryRange.value.map(Number) as [number, number]);

watch(
	() => {
		return route.name;
	},
	() => {
		return (slider.value = [1600, 1900]);
	},
);
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
						class="group m-2 flex h-fit items-center gap-4 rounded border p-2 shadow transition hover:bg-slate-200 active:bg-slate-300 xl:mx-0"
						:class="$route.path === link.href.path && 'bg-slate-200'"
						:to="link.href"
					>
						<component
							:is="link.icon"
							v-if="link.icon"
							class="transition group-hover:scale-110 group-active:scale-90"
						/>
						{{ link.label }}
					</NuxtLink>

					<NuxtLink
						v-for="link of inactiveLinks"
						:key="link.label"
						aria-disabled
						class="pointer-events-none m-2 flex h-fit items-center gap-4 rounded border p-2 opacity-50 shadow transition xl:mx-0"
					>
						<component :is="link.icon" v-if="link.icon" />
						{{ link.label }}
					</NuxtLink>
				</div>

				<div class="mx-4 xl:max-w-sm">
					<ClientOnly>
						<GenericDisclosure default-open :title="t('ui.timespan')">
							<div class="flex flex-col gap-1 p-2">
								<RangeSlider v-model="slider" class="p-1" :max="1900" :min="1600" :n-marker="7" />
								<div class="flex items-center justify-between gap-1">
									<div class="flex gap-2">
										<input
											id="dateCheck"
											v-model="includeDateless"
											class="accent-primary-500"
											type="checkbox"
											@change="updateFacets()"
										/>
										<label class="text-sm text-gray-600" for="dateCheck">
											{{ t("ui.include-dates") }}
										</label>
									</div>
									<div class="mt-1 flex">
										<NuxtLink
											class="rounded border bg-slate-100 p-2 shadow transition hover:bg-slate-200 active:bg-slate-300"
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
											<CalendarSearch class="size-5" />
											<span class="sr-only">Apply time filters</span>
										</NuxtLink>
									</div>
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
