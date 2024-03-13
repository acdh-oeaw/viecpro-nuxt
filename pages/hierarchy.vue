<script lang="ts" setup>
import { useQuery } from "@tanstack/vue-query";
import { Loader2 } from "lucide-vue-next";

import HierarchyWrapper from "@/components/hierarchy-wrapper.vue";
import { getTreeData } from "@/lib/get-tree-data";

const router = useRouter();
const route = useRoute();

const t = useTranslations();

const comQuery = computed({
	get() {
		const { label, id, model } = route.query;

		if (!label || !id || !model) return null;

		return {
			group: decodeURIComponent(String(model)),
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
					model: encodeURIComponent(to.group),
					label: encodeURIComponent(to.label),
				},
			});
	},
});

const showArgs = computed(() => {
	switch (route.query.model) {
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

const comOptions = computed({
	get() {
		const { direction, show } = route.query;
		return {
			direction: direction
				? { value: String(direction), label: t(`pages.hierarchy.options.${String(direction)}`) }
				: { label: t("pages.hierarchy.options.down"), value: "down" },
			show: show
				? { value: String(show), label: t(`pages.hierarchy.options.${String(show)}`) }
				: { label: showArgs.value[0]?.label, value: showArgs.value[0]?.label },
		};
	},
	set(to) {
		void router.push({
			query: {
				...route.query,
				show: to.show.value,
				direction: to.show.value,
			},
		});
	},
});

const query = ref(
	useQuery({
		queryKey: ["hierarchy", comQuery, comOptions] as const,
		queryFn: async ({ queryKey }) => {
			const [, auto, q] = queryKey;

			if (!auto) return null;

			const data = await getTreeData({
				show: String(q.show.value),
				direction: String(q.direction.value),
				model: auto.group,
				id: String(auto.pk),
			});

			return data;
		},
	}),
);

definePageMeta({
	title: "pages.hierarchy.title",
});
</script>

<template>
	<MainContent class="relative mx-auto grid w-full grid-flow-row grid-rows-[auto_1fr]">
		<div class="container mx-auto flex flex-wrap">
			<Autocomplete v-model="comQuery" />
			<ClientOnly>
				<GenericListbox
					v-model="comOptions.show"
					class="m-2 min-w-56"
					:items="showArgs"
					@change="({ value }) => router.push({ query: { ...route.query, show: value } })"
				/>
				<GenericListbox
					v-model="comOptions.direction"
					class="m-2 min-w-48"
					:items="[
						{ value: 'down', label: t('pages.hierarchy.options.down') },
						{ value: 'up', label: t('pages.hierarchy.options.up') },
					]"
					@change="
						({ value }) => {
							router.push({ query: { ...route.query, direction: value } });
						}
					"
				/>
			</ClientOnly>

			<div class="m-2 h-11 w-fit self-end rounded border bg-white p-2 shadow-lg">
				<div class="flex items-center gap-x-2">
					<h3>{{ t("pages.hierarchy.legend.legend") }}:</h3>
					<div class="h-4 w-4 rounded-full border bg-[tomato] shadow" />
					<div>Institution</div>
					<div class="h-4 w-4 rounded-full border bg-[yellowgreen] shadow" />
					<div>{{ t("pages.hierarchy.legend.function") }}</div>
					<div class="h-4 w-4 rounded-full border bg-[lightskyblue] shadow" />
					<div>Person</div>
				</div>
			</div>
		</div>
		<div class="w-full">
			<ClientOnly v-if="!query.isFetching">
				<VisContainer v-slot="{ width }" class="my-4 flex items-center">
					<HierarchyWrapper v-if="query.data" :data="query.data" :width="width" />
				</VisContainer>
			</ClientOnly>
			<Centered v-else>
				<Loader2 class="h-8 w-8 animate-spin" />
			</Centered>
		</div>
	</MainContent>
</template>
