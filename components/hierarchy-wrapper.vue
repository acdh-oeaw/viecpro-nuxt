<script lang="ts" setup>
import { hierarchy } from "d3";

import type { TreeEntity } from "@/lib/get-tree-data";
import { Tree } from "@/lib/tree";

const router = useRouter();

const localePath = useLocalePath();

const props = defineProps<{
	data: TreeEntity;
	width: number;
}>();

const hierarchyRef = ref<SVGElement | null>(null);

onMounted(() => {
	updateTree(props.data, props.width);
});
watch(
	() => [props.data, props.width],
	([to, newWidth]) => {
		updateTree(to as TreeEntity, newWidth as number);
	},
	{ deep: true },
);

interface Node {
	data: {
		children: Array<Node>;
		name: string;
		meta: {
			end: string;
			entity_type: string;
			label: string;
			pk: number;
			rel_end: string;
			rel_start: string;
			start: string;
			url: string;
		};
	};
	depth: number;
	height: number;
	parent?: Node;
}

function updateTree(data: TreeEntity, width: number) {
	const options = {
		label: (d: Node) => d.data.meta.label,
		link: (d: Node) =>
			localePath(
				`/hierarchy?id=${d.data.meta.pk}&model=${d.data.meta.entity_type}&label=${d.data.meta.label}`,
			),
		width,
		r: 7,
		fontSize: "medium",
		padding: 2,
	};

	hierarchyRef.value = Tree(hierarchy(data), options);
}
</script>

<template>
	<!-- eslint-disable vuejs-accessibility/no-static-element-interactions -->
	<!-- eslint-disable vuejs-accessibility/click-events-have-key-events -->
	<div
		class="w-full"
		@click.prevent="
			(event) =>
				event.target?.parentNode?.href ? router.push(event.target.parentNode.href.baseVal) : null
		"
		v-html="hierarchyRef?.outerHTML"
	/>
</template>
