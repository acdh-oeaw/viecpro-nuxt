<script lang="ts" setup>
import MainContent from "@/components/main-content.vue";
import { useI18n } from "@/composables/use-i18n";
import { ContentQuery, ContentRenderer, ContentRendererMarkdown } from "#components";
import { computed, definePageMeta, useRoute } from "#imports";

const { locale } = useI18n();
definePageMeta({
	title: "pages.documentation.title",
});

const route = useRoute();
const currentDoc = computed(() => {
	if (route.params.slug === undefined) {
		return "/project";
	} else {
		return route.params.slug[0];
	}
});
</script>

<template>
	<div class="mx-auto my-8 grid gap-10 xl:grid-cols-[auto_1fr]">
		<nav>
			<ContentNavigation v-slot="{ navigation }">
				<ul class="w-fit rounded bg-gray-200 py-3 pl-6 pr-14 text-lg font-black">
					<li v-for="link of navigation" :key="link._path">
						<NuxtLink :to="`/${locale}/documentation${link._path}`">{{ link.title }}</NuxtLink>
					</li>
				</ul>
			</ContentNavigation>
		</nav>
		<MainContent class="px-6 py-4">
			<ContentQuery v-slot="{ data }" :path="currentDoc" :where="{ _locale: locale }" find="one">
				<ContentRenderer :value="data">
					<ContentRendererMarkdown :value="data" class="prose w-[60rem]"></ContentRendererMarkdown>
				</ContentRenderer>
			</ContentQuery>
		</MainContent>
	</div>
</template>
