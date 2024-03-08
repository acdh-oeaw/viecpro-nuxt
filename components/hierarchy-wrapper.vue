<script lang="ts" setup>
import { hierarchy } from "d3";

import type { TreeEntity } from "@/lib/get-tree-data";
import { Tree } from "@/lib/tree";

const locale = useLocale();

const props = defineProps<{
	data: TreeEntity;
}>();

const hierarchyRef = ref<SVGElement | null>(null);
const visContainer = ref<HTMLElement | null>(null);
const dimensions = ref<DOMRect | null>(null);

onMounted(() => {
	if (visContainer.value == null) return;
	updateTree(props.data);
	observer.observe(visContainer.value);
});
watch(
	() => props.data,
	(to) => {
		updateTree(to);
	},
	{ deep: true },
);

function updateTree(data: TreeEntity) {
	const options = {
		label: (d) => d.data.meta.label,
		link: (d) =>
			`/${locale.value}/detail/${d.data.meta.entity_type.toLowerCase()}s/${d.data.meta.pk}`,
	};

	hierarchyRef.value = Tree(hierarchy(data), options);
}

const observer = new ResizeObserver((entries) => {
	const [entry] = entries;
	if (entry == null) return;
	dimensions.value = entry.contentRect;
});

onUnmounted(() => {
	observer.disconnect();
});
</script>

<template>
	<div ref="visContainer" class="h-full min-h-96 w-full">
		<div id="test" v-html="hierarchyRef?.outerHTML"></div>
	</div>
</template>
