<script lang="ts" setup>
import { ChevronRight } from "lucide-vue-next";

const t = useTranslations();
const locale = useLocale();
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
	<div class="grid w-full lg:grid-cols-[1fr_3fr] lg:gap-10 2xl:grid-cols-[1fr_2fr_1fr]">
		<nav class="lg:justify-self-end" data-testid="docNav">
			<ContentNavigation v-slot="{ navigation }" :query="{ where: [{ _locale: locale }] }">
				<!-- :where="{ _locale: locale }" -->
				<ul class="m-4 rounded bg-gray-200 p-4 text-lg shadow">
					<h2 class="mb-2 text-xl font-black">
						{{ t("pages.documentation.contents") }}
					</h2>
					<li v-for="link of navigation" :key="link._path">
						<NuxtLink
							:to="`/${locale}/documentation${link._path}`"
							class="flex w-full items-center gap-1 rounded px-2 transition hover:bg-gray-300 active:bg-gray-400"
						>
							<ChevronRight class="h-4 w-4" />
							<span>
								{{ link.title }}
							</span>
						</NuxtLink>
					</li>
				</ul>
			</ContentNavigation>
		</nav>
		<MainContent class="w-full px-6 py-4">
			<ContentQuery v-slot="{ data }" :path="currentDoc" :where="{ _locale: locale }" find="one">
				<ContentRenderer v-if="data" :value="data">
					<ContentRendererMarkdown :value="data" class="prose" />
				</ContentRenderer>
			</ContentQuery>
		</MainContent>
	</div>
</template>
