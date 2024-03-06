<script lang="ts" setup>
import { hierarchy } from "d3";

import { Tree } from "@/lib/tree";

const locale = useLocale();

const props = defineProps<{
	data: object;
}>();

const hierarchyRef = ref<SVGElement | null>(null);

onMounted(() => {
	updateTree(props.data);
});
watch(
	() => props.data,
	(to) => {
		updateTree(to);
	},
	{ deep: true },
);

function updateTree(data) {
	const options = {
		label: (d) => d.data.meta.label,
		link: (d) =>
			`/${locale.value}/detail/${d.data.meta.entity_type.toLowerCase()}s/${d.data.meta.pk}`,
		width: 2000,
		height: 500,
	};

	hierarchyRef.value = Tree(hierarchy(data), options);
}
</script>

<template>
	<div id="test" v-html="hierarchyRef?.outerHTML"></div>
</template>
