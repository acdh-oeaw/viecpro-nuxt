<script lang="ts" setup>
import { ref } from "vue";

import MainContent from "@/components/main-content.vue";
import { ContentDoc } from "#components";
import { definePageMeta } from "#imports";

definePageMeta({
	title: "pages.documentation.title",
});

const currentDoc = ref("/data");
const setDoc = (doc: string) => {
	currentDoc.value = doc;
};
</script>

<template>
	<div class="mx-auto my-8 grid gap-10 xl:grid-cols-[auto_1fr]">
		<nav>
			<ContentNavigation v-slot="{ navigation }">
				<ul class="w-fit rounded bg-gray-200 py-3 pl-6 pr-14 text-lg font-black">
					<li v-for="link of navigation" :key="link._path">
						<!-- <NuxtLink :to="link._path">{{
							link.title }}</NuxtLink> -->
						<button class="my-2 hover:text-primary-100" @click="setDoc(link._path)">
							{{ link.title }}
						</button>
					</li>
				</ul>
			</ContentNavigation>
		</nav>
		<MainContent class="px-6 py-4">
			<ContentDoc :path="currentDoc" class="prose w-[60rem]"></ContentDoc>
		</MainContent>
	</div>
</template>
