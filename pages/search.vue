<script lang="ts" setup>
import { CalendarRange, FileText, MapPin, School2, User, Users } from "lucide-vue-next";

import MainContent from "@/components/main-content.vue";
import type { NavLink } from "@/types/misc.d.ts";
import { NuxtLink } from "#components";
import { computed, definePageMeta, useI18n, useLocalePath } from "#imports";

const { t } = useI18n();
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
		references: {
			href: { path: localePath("/search/references") },
			label: t("pages.searchviews.references.label"),
			icon: FileText,
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
			<div>
				<NuxtPage />
			</div>
		</div>
	</MainContent>
</template>
