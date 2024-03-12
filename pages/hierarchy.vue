<script lang="ts" setup>
import { useQuery } from "@tanstack/vue-query";
import { Loader2 } from "lucide-vue-next";

import HierarchyWrapper from "@/components/hierarchy-wrapper.vue";
import { getTreeData } from "@/lib/get-tree-data";
import type { HierarchyNode } from "@/lib/types";

const router = useRouter();
const route = useRoute();

const t = useTranslations();

const comQuery = computed(() => {
	const { label, id, model } = route.query;

	if (!label || !id || !model) return null;

	return {
		group: decodeURIComponent(String(model)),
		pk: Number(id),
		label: String(decodeURIComponent(String(label))),
	};
});

const comOptions = computed(() => {
	const { direction, show } = route.query;
	return {
		direction: direction
			? { value: String(direction), label: t(`pages.hierarchy.options.${String(direction)}`) }
			: { label: t("pages.hierarchy.options.down"), value: "down" },
		show: show
			? { value: String(show), label: t(`pages.hierarchy.options.${String(show)}`) }
			: { label: "Normal", value: "normal" },
	};
});

const autocomplete = ref<HierarchyNode | null>(comQuery.value);
const options = ref<{
	show: { label: string; value: string };
	direction: { label: string; value: string };
}>(comOptions.value);

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

const showArgs = computed(() => {
	switch (autocomplete.value?.group) {
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
			if (!instArgs.map((arg) => arg.label).includes(options.value.show.value) && instArgs[0])
				options.value.show = instArgs[0];
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
			if (!funcArgs.map((arg) => arg.value).includes(options.value.show.value) && funcArgs[0])
				options.value.show = funcArgs[0];
			return funcArgs;
		}
		default: {
			options.value.show = { value: "normal", label: t("pages.hierarchy.options.normal") };
			return [{ value: "normal", label: t("pages.hierarchy.options.normal") }];
		}
	}
});

definePageMeta({
	title: "pages.hierarchy.title",
});
</script>

<template>
	<MainContent class="container mx-auto grid grid-flow-row grid-rows-[auto_1fr]">
		<div class="flex">
			<Autocomplete
				v-model="autocomplete"
				@change="
					autocomplete
						? router.push({
								query: {
									...route.query,
									id: autocomplete.pk,
									model: encodeURIComponent(autocomplete.group),
									label: encodeURIComponent(autocomplete.label),
								},
							})
						: null
				"
			/>
			<ClientOnly>
				<GenericListbox
					v-model="options.direction"
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
				<GenericListbox
					v-model="options.show"
					class="m-2 min-w-56"
					:items="showArgs"
					@change="({ value }) => router.push({ query: { ...route.query, show: value } })"
				/>
			</ClientOnly>
		</div>
		<div>
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
