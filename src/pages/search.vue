<script lang="ts" setup>
import { CalendarRange, MapPin, School2, User, Users } from "lucide-vue-next";

import MainContent from "@/components/main-content.vue";
import { type NavLink } from "@/types/misc";
import { NuxtLink } from "#components";
import { computed, definePageMeta, useI18n, useLocalePath } from "#imports";

const { t } = useI18n();
const localePath = useLocalePath();

const links = computed(() => {
	return {
		courts: {
			href: { path: localePath("/search/courts") },
			label: t("pages.searchviews.courts.label"),
			icon: Users,
		},
		people: {
			href: { path: localePath("/search/persons") },
			label: t("pages.searchviews.people.label"),
			icon: User,
		},
		places: {
			href: { path: localePath("/search/places") },
			label: t("pages.searchviews.places.label"),
			icon: MapPin,
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
	} satisfies Record<string, NavLink>;
});

definePageMeta({
	title: "pages.search.title",
});
</script>

<template>
	<MainContent>
		<div class="grid grid-cols-[2fr_6fr] gap-4">
			<div class="m-4 flex max-w-sm flex-col gap-4">
				<NuxtLink
					v-for="link in links"
					:key="link.label"
					:to="link.href"
					class="group flex items-center gap-4 rounded border p-2 transition hover:bg-slate-200 active:bg-slate-300"
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
			<div>
				<NuxtPage />
			</div>
		</div>
	</MainContent>
</template>
