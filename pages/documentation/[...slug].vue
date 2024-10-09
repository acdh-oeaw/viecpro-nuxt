<script lang="ts" setup>
import { ChevronRight } from "lucide-vue-next";

import { queryContent } from "#imports";

defineRouteRules({
	prerender: true,
});

const t = useTranslations();

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

useHead({
	title: t("pages.documentation.title"),
});
</script>

<template>
	<div class="grid w-full lg:grid-cols-[1fr_3fr] lg:gap-10 2xl:grid-cols-[1fr_2fr_1fr]">
		<nav class="lg:justify-self-end" data-testid="docNav">
			<ContentNavigation
				v-slot="{ navigation }"
				:query="queryContent().where({ _path: /\/documentation/ })"
			>
				<div class="m-4 rounded bg-gray-200 p-4 text-lg shadow">
					<h2 class="mb-2 text-xl font-black">
						{{ t("pages.documentation.contents") }}
					</h2>
					<ul>
						<li v-for="link of navigation[0]?.children" :key="link._path">
							<NuxtLink
								:to="link._path"
								class="flex w-full items-center gap-1 rounded px-2 transition hover:bg-gray-300 active:bg-gray-400"
							>
								<ChevronRight class="size-4" />
								<span>
									{{ link.title }}
								</span>
							</NuxtLink>
						</li>
					</ul>
				</div>
			</ContentNavigation>
		</nav>
		<MainContent class="w-full px-6 py-4">
			<ContentQuery v-slot="{ data }" :path="`documentation/${currentDoc}`" find="one">
				<ContentRenderer v-if="data" :value="data">
					<ContentRendererMarkdown :value="data" class="prose prose-sm md:prose-base" />
				</ContentRenderer>
			</ContentQuery>
		</MainContent>
	</div>
</template>
