<script lang="ts" setup>
import {
	CalendarRangeIcon,
	FileTextIcon,
	type Icon,
	MapPinIcon,
	School2Icon,
	UserIcon,
	UsersIcon,
} from "lucide-vue-next";

import type { NavLinkProps } from "@/components/nav-link.vue";

definePageMeta({
	title: "SearchPage.meta.title",
});

const t = useTranslations();

const links = computed(() => {
	return {
		courts: {
			href: { path: "/search/courts" },
			label: t("pages.searchviews.courts.label"),
			icon: UsersIcon,
		},
		references: {
			href: { path: "/search/references" },
			label: t("pages.searchviews.references.label"),
			icon: FileTextIcon,
		},
		people: {
			href: { path: "/search/persons" },
			label: t("pages.searchviews.people.label"),
			icon: UserIcon,
		},
		places: {
			href: { path: "/search/places" },
			label: t("pages.searchviews.places.label"),
			icon: MapPinIcon,
		},
		institutions: {
			href: { path: "/search/institutions" },
			label: t("pages.searchviews.institutions.label"),
			icon: School2Icon,
		},
		events: {
			href: { path: "/search/events" },
			label: t("pages.searchviews.events.label"),
			icon: CalendarRangeIcon,
		},
	} satisfies Record<string, { href: NavLinkProps["href"]; label: string; icon: Icon }>;
});
</script>

<template>
	<MainContent>
		<div class="grid h-full grid-rows-[auto_1fr] gap-4 xl:grid-cols-[2fr_6fr]">
			<div
				class="m-2 mx-auto flex h-fit max-w-fit flex-wrap lg:mx-4 xl:m-4 xl:max-w-sm xl:flex-col"
			>
				<NavLink
					v-for="link in links"
					:key="link.label"
					class="group m-2 flex h-fit items-center gap-4 rounded-md border p-2 shadow transition hover:bg-neutral-200 active:bg-neutral-300 xl:mx-0"
					:class="$route.path === link.href.path && 'bg-neutral-200'"
					:href="link.href"
				>
					<component
						:is="link.icon"
						v-if="link.icon"
						class="transition group-hover:scale-110 group-active:scale-90"
					/>
					{{ link.label }}
				</NavLink>
			</div>
			<div>
				<NuxtPage />
			</div>
		</div>
	</MainContent>
</template>
