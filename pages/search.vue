<script lang="ts" setup>
// eslint-disable vue/component-name-in-template-casing
import { Slider } from "@ark-ui/vue";
import { CalendarRange, MapPin, School2, User, Users } from "lucide-vue-next";

import type { NavLink } from "@/types/misc.d.ts";

const range = ref([1700, 1900]);

const { Root, Label: Sliderlabel, Control, Thumb, MarkerGroup, Marker, Range, Track } = Slider; // important

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
				<div>
					<ClientOnly>
						<Root v-model="range" :min="1700" :max="1900" class="flex flex-col gap-2">
							<Sliderlabel>{{ t("ui.timespan") }}</Sliderlabel>
							<div class="my-1 flex justify-between">
								<div>
									<label for="start_year" class="sr-only">Select start year</label>
									<input
										id="start_year"
										v-model="range[0]"
										class="w-16 rounded border text-right"
										type="number"
										:min="1700"
										:max="1900"
										name="start_year"
										@input="
											(event: Event) =>
												(range = [
													(event.target as HTMLInputElement).valueAsNumber,
													Number(range[1]),
												])
										"
									/>
								</div>
								<div>
									<label for="end_year" class="sr-only">Select end year</label>
									<input
										id="end_year"
										v-model="range[1]"
										class="w-16 rounded border text-right"
										type="number"
										:min="1700"
										:max="1900"
										name="end_year"
										@input="
											(event: Event) =>
												(range = [
													Number(range[0]),
													(event.target as HTMLInputElement).valueAsNumber,
												])
										"
									/>
								</div>
							</div>
							<Control class="relative flex items-center">
								<Track class="h-1 flex-1 rounded bg-slate-200">
									<Range class="h-1 rounded bg-primary-600" />
								</Track>
								<Thumb
									:key="0"
									:index="0"
									class="absolute h-4 w-4 cursor-pointer rounded-l-full border border-primary-600 bg-white"
								/>
								<Thumb
									:key="1"
									:index="1"
									class="h-4 w-4 cursor-pointer rounded-r-full border border-primary-600 bg-white"
								/>
							</Control>
							<MarkerGroup class="h-40">
								<Marker :value="1700" class="text-slate-400">1700</Marker>
								<Marker :value="1750" class="text-slate-400">&#183;</Marker>
								<Marker :value="1800" class="text-slate-400">1800</Marker>
								<Marker :value="1850" class="text-slate-400">&#183;</Marker>
								<Marker :value="1900" class="text-slate-400">1900</Marker>
							</MarkerGroup>
						</Root>
					</ClientOnly>
				</div>
			</div>
			<div>
				<NuxtPage />
			</div>
		</div>
	</MainContent>
</template>
