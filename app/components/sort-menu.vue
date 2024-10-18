<script setup lang="ts">
import { ArrowDownNarrowWide, ArrowDownWideNarrow } from "lucide-vue-next";

const props = defineProps<{
	cols: Array<string>;
	collection: string;
}>();

const route = useRoute();
const router = useRouter();

const t = useTranslations();
const sortedCol = computed({
	get() {
		if (route.query.sort) {
			const col = String(route.query.sort).split(":")[0];

			return { value: col, label: t(`collection-keys.${props.collection}.${col}`) };
		}
		return null;
	},
	set(to) {
		void router.push({
			query: {
				sort: `${to?.value}:asc`,
			},
		});
	},
});
const direction = computed({
	get() {
		if (route.query.sort) {
			const dir = String(route.query.sort).split(":")[1] as "asc" | "desc" | undefined;
			const labels = {
				asc: t("collection-keys.generic.asc"),
				desc: t("collection-keys.generic.desc"),
			};
			if (dir) return { value: dir, label: labels[dir] };
		}
		return { value: "asc", label: t("collection-keys.generic.asc") };
	},
	set(to) {
		void router.push({
			query: {
				sort: `${sortedCol.value?.value}:${to.value}`,
			},
		});
	},
});
</script>

<template>
	<div v-if="cols.length" class="flex items-center gap-2">
		<GenericListbox
			v-model="sortedCol"
			button-class="shadow-none"
			:default-label="t('ui.sort-by-short')"
			:items="cols.map((col) => ({ value: col, label: t(`collection-keys.${collection}.${col}`) }))"
		>
			<template #label>
				<div>
					<span class="sr-only">{{ t("ui.sort-by-short") }}</span>
					<ArrowDownNarrowWide v-if="direction.value === 'desc'" class="size-6" />
					<ArrowDownWideNarrow v-else class="size-6" />
				</div>
			</template>
		</GenericListbox>
		<GenericListbox
			v-model="direction"
			button-class="shadow-none"
			:disabled="!sortedCol"
			:items="[
				{ value: 'asc', label: t('collection-keys.generic.asc') },
				{ value: 'desc', label: t('collection-keys.generic.desc') },
			]"
		/>
	</div>
	<div v-else />
</template>
