<script lang="ts" setup>
definePageMeta({
	title: "DocumentationPage.meta.title",
	// TODO: validate
});

const locale = useLocale();
const t = useTranslations("DocumentationPage");

const route = useRoute();
const id = route.params.id as string;

const content = await useAsyncData(["documentation", locale, id].join("+"), () => {
	return queryContent("/documentation/" + id)
		.locale(locale.value)
		.findOne();
});

const navigation = await useAsyncData(["documentation-nav", locale].join("+"), () => {
	return fetchContentNavigation(queryContent("/documentation").locale(locale.value));
});
</script>

<template>
	<div class="container grid content-start gap-12 py-16">
		<nav :aria-label="t('navigation-documentation')">
			<ul role="list">
				<li v-for="link of navigation.data.value?.at(0)?.children" :key="link._path">
					<NavLink :href="{ path: link._path }">{{ link.title }}</NavLink>
				</li>
			</ul>
		</nav>

		<MainContent>
			<ContentRenderer
				v-if="content.data.value"
				class="prose max-w-3xl"
				:value="content.data.value"
			/>
		</MainContent>
	</div>
</template>
