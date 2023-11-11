<script lang="ts" setup>
import { ChevronRightIcon } from "lucide-vue-next";

definePageMeta({
	title: "DocumentationPage.meta.title",
	// TODO:
	// validate(route) {},
});

const locale = useLocale();
const t = useTranslations();

const route = useRoute();
const id = computed(() => {
	return route.params.id as Array<string>;
});

const content = await useAsyncData(
	createKey("documentation", locale, ...id.value),
	() => {
		return queryContent("/documentation", ...id.value)
			.locale(locale.value)
			.findOne();
	},
	{ watch: [locale, id] },
);

if (content.error.value != null) {
	if ("statusCode" in content.error.value && content.error.value.statusCode === 404) {
		throw createError({
			fatal: true,
			statusCode: 404,
			statusMessage: t("DocumentationPage.error.not-found"),
		});
	} else {
		throw createError({
			fatal: true,
			statusCode: 500,
			statusMessage: t("DocumentationPage.error.unknown"),
		});
	}
}

// @ts-expect-error Upstream type issue.
useContentHead(content.data);

const navigation = await useAsyncData(
	createKey("documentation-navigation", locale),
	() => {
		return fetchContentNavigation(queryContent("/documentation").locale(locale.value));
	},
	{ watch: [locale] },
);

const links = computed(() => {
	return navigation.data.value?.at(0)?.children ?? [];
});
</script>

<template>
	<div class="grid w-full lg:grid-cols-[1fr_3fr] lg:gap-10 2xl:grid-cols-[1fr_2fr_1fr]">
		<nav :aria-label="t('DocumentationPage.navigation')" class="lg:justify-self-end">
			<ul class="m-4 rounded-md bg-neutral-200 p-4 text-lg shadow" role="list">
				<li v-for="link of links" :key="link._path">
					<NavLink
						class="flex w-full items-center gap-1 rounded-md px-2 transition hover:bg-neutral-300 active:bg-neutral-400"
						:href="{ path: link._path }"
					>
						<ChevronRightIcon class="h-4 w-4" />
						{{ link.title }}
					</NavLink>
				</li>
			</ul>
		</nav>

		<MainContent class="prose max-w-3xl py-8 prose-headings:text-brand-600">
			<h1>{{ content.data.value?.title }}</h1>

			<ContentRenderer v-if="content.data.value" :value="content.data.value" />
		</MainContent>
	</div>
</template>
