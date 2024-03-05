<script lang="ts" setup>
import HierarchyWrapper from "@/components/hierarchy-wrapper.vue";
import { getTreeData } from "@/lib/get-tree-data";
import { data } from "@/lib/tree-test-data";

let tree = ref(data);

const query = ref({ model: "Institution", id: "291950", show: "normal" });
const getTree = async () => {
	const data = await getTreeData({
		id: query.value.id,
		model: query.value.model,
		show: query.value.show,
	});
	tree.value = data;
};

definePageMeta({
	title: "pages.hierarchy.title",
});
</script>

<template>
	<MainContent class="container mx-auto">
		<div>Hierarchy goes here</div>
		<div>
			<ClientOnly>
				<HierarchyWrapper :data="tree" />
			</ClientOnly>
			<div>
				<label for="idInput">ID: </label>
				<input id="idInput" v-model="query.id" type="text" name="id" />
			</div>
			<div>
				<label for="modelInput">Model</label>
				<input id="modelInput" v-model="query.model" type="text" name="id" />
			</div>
			<div>
				<h1>show</h1>
				<div>
					<input id="normal" v-model="query.show" value="normal" type="radio" name="id" />
					<label for="normal">normal</label>
				</div>
				<div>
					<input
						id="show%20only%20institutions"
						v-model="query.show"
						value="show%20only%20institutions"
						type="radio"
						name="id"
					/>
					<label for="show%20only%20institutions">show only institutions</label>
				</div>
				<div>
					<input
						id="add%20functions"
						v-model="query.show"
						value="add%20functions"
						type="radio"
						name="id"
					/>
					<label for="add%20functions">add functions</label>
				</div>
				<div>
					<input
						id="show%20institution%20hierarchy"
						v-model="query.show"
						value="show%20institution%20hierarchy"
						type="radio"
						name="id"
					/>
					<label for="show%20institution%20hierarchy">show institution hierarchy</label>
				</div>
				<div>
					<input id="normal" v-model="query.show" value="normal" type="radio" name="id" />
					<label for="normal">normal</label>
				</div>
			</div>
			<div>
				<button class="rounded border p-2" @click="getTree">Go!</button>
			</div>
			<pre>
				{{ query }}
			</pre
			>
		</div>
	</MainContent>
</template>
