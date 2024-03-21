<script lang="ts" setup>
import { useQuery } from "@tanstack/vue-query";
import { ArrowRight, Loader2 } from "lucide-vue-next";

import HierarchyWrapper from "@/components/hierarchy-wrapper.vue";
import { getTreeData } from "@/lib/get-tree-data";

const router = useRouter();
const route = useRoute();

const t = useTranslations();
const localePath = useLocalePath();

const comQuery = computed({
	get() {
		const { label, id, model } = route.query;

		if (!label || !id || !model) return null;

		return {
			group: String(model),
			pk: Number(id),
			label: String(decodeURIComponent(String(label))),
		};
	},
	set(to) {
		if (to)
			void router.push({
				query: {
					...route.query,
					id: to.pk,
					model: to.group,
					label: to.label,
				},
			});
	},
});

const showItems = computed(() => {
	switch (comQuery.value?.group) {
		case "Institution": {
			const instArgs = [
				{
					value: "show only institutions",
					label: t("pages.hierarchy.options.show only institutions"),
				},
				{ value: "add functions", label: t("pages.hierarchy.options.add functions") },
				{
					value: "add functions and persons",
					label: t("pages.hierarchy.options.add functions and persons"),
				},
			];
			return instArgs;
		}
		case "Funktion": {
			const funcArgs = [
				{
					value: "show institution hierarchy",
					label: t("pages.hierarchy.options.show institution hierarchy"),
				},
				{ value: "show amt and persons", label: t("pages.hierarchy.options.show amt and persons") },
			];
			return funcArgs;
		}
		default: {
			return [{ value: "normal", label: t("pages.hierarchy.options.normal") }];
		}
	}
});

const direction = computed({
	get() {
		const { direction } = route.query;
		return direction
			? { value: String(direction), label: t(`pages.hierarchy.options.${String(direction)}`) }
			: { label: t("pages.hierarchy.options.down"), value: "down" };
	},
	set(to) {
		void router.push({
			query: {
				...route.query,
				direction: to.value,
			},
		});
	},
});

const show = computed({
	get() {
		const { show } = route.query;
		return show
			? { value: String(show), label: t(`pages.hierarchy.options.${String(show)}`) }
			: { label: showItems.value[0]?.label, value: showItems.value[0]?.label };
	},
	set(to) {
		void router.push({
			query: {
				...route.query,
				show: to.value,
			},
		});
	},
});

const query = ref(
	useQuery({
		queryKey: ["hierarchy", comQuery, direction, show] as const,
		queryFn: async ({ queryKey }) => {
			const [, auto, dir, show] = queryKey;

			if (!auto) return null;

			const data = await getTreeData({
				show: String(show.value),
				direction: String(dir.value),
				model: auto.group,
				id: String(auto.pk),
			});

			return data;
		},
	}),
);

definePageMeta({
	title: "pages.hierarchy.title",
	layout: "max-content",
});
useHead({
	title: t("pages.hierarchy.label"),
});
</script>

<template>
	<MainContent class="relative mx-auto grid w-full grid-flow-row grid-rows-[auto_1fr]">
		<div class="container mx-auto flex flex-wrap justify-between">
			<div class="flex flex-wrap">
				<Autocomplete v-model="comQuery" />
				<GenericListbox v-model="show" class="m-2 w-full min-w-56 md:w-auto" :items="showItems" />
				<GenericListbox
					v-if="comQuery?.group === 'Institution'"
					v-model="direction"
					class="m-2 w-full min-w-48 md:w-auto"
					:items="[
						{ value: 'down', label: t('pages.hierarchy.options.down') },
						{ value: 'up', label: t('pages.hierarchy.options.up') },
					]"
				/>
				<NuxtLink
					v-if="comQuery && ['Person', 'Institution'].includes(comQuery.group)"
					:href="localePath(`/detail/${comQuery.group.toLowerCase()}s/${comQuery.pk}`)"
					class="self-end"
				>
					<button
						class="m-2 flex min-h-11 w-full items-center gap-1 rounded border bg-white px-2 shadow-md transition hover:bg-slate-200 active:bg-slate-300"
					>
						<span>{{ t("pages.hierarchy.options.goto") }}</span>
						<ArrowRight class="h-5 w-5 shrink-0" />
					</button>
				</NuxtLink>
			</div>
			<div class="m-2 min-h-11 w-full self-end rounded border bg-white p-2 shadow-lg md:w-fit">
				<div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
					<h3>{{ t("pages.hierarchy.legend.legend") }}:</h3>
					<div class="flex gap-x-3">
						<div class="flex items-center gap-1">
							<div class="h-4 w-4 rounded-full border bg-[tomato] shadow" />
							<div>Institution</div>
						</div>
						<div class="flex items-center gap-1">
							<div class="h-4 w-4 rounded-full border bg-[yellowgreen] shadow" />
							<div>{{ t("pages.hierarchy.legend.function") }}</div>
						</div>
						<div class="flex items-center gap-1">
							<div class="h-4 w-4 rounded-full border bg-[lightskyblue] shadow" />
							<div>Person</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="w-full">
			<ClientOnly v-if="!query.isFetching">
				<VisContainer v-slot="{ width }" class="flex items-center">
					<HierarchyWrapper v-if="query.data" :data="query.data" :width="width" />
				</VisContainer>
			</ClientOnly>
			<Centered v-else>
				<Loader2 class="h-8 w-8 animate-spin" />
			</Centered>
		</div>
	</MainContent>
</template>
