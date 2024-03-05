<script lang="ts" setup>
import { hierarchy } from "d3";

import { Tree } from "@/lib/tree";

const props = defineProps<{
	data: object;
}>();

const hierarchyRef = ref<SVGElement | null>(null);

onMounted(() => {
	hierarchyRef.value = Tree(hierarchy(props.data));
});
watch(
	() => props.data,
	(to) => {
		hierarchyRef.value = Tree(hierarchy(to));
	},
	{ deep: true },
);
</script>

<template>
	<div id="test" v-html="hierarchyRef?.outerHTML"></div>
</template>
