<script lang="ts" setup>
import { ArrowLeftRight, CalendarRange, MapPin, School2, User, Users } from "lucide-vue-next";

import GenericDisclosure from "@/components/generic-disclosure.vue";
import RangeSlider from "@/components/range-slider.vue";
import type { NavLink } from "@/types/misc.d.ts";

const t = useTranslations();
const localePath = useLocalePath();
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
							<div class="p-2">
								<RangeSlider class="p-1" @change="(value) => console.log(value)" />
								<div class="mt-1 text-xs text-gray-400">
									note: as of now this component is purely cosmetic
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
