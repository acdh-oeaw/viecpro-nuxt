<script lang="ts" setup>
definePageMeta({
	title: "IndexPage.meta.title",
});

const locale = useLocale();

const content = useAsyncData(
	createKey("content", locale, "home"),
	() => {
		return queryContent("/home").locale(locale.value).findOne();
	},
	{ watch: [locale] },
);
</script>

<template>
	<div class="border-y-8 border-b-brand-600 border-t-brand-950">
		<img alt="" class="h-96 w-full object-cover" :src="content.data.value?.hero.image" />
	</div>

	<MainContent class="container py-8">
		<div class="pb-16 pt-24">
			<h1 class="grid justify-center text-4xl text-brand-600 lg:inline lg:text-5xl">
				<span class="font-black">{{ content.data.value?.title }}</span>
				<span class="hidden px-2 font-black lg:inline">.</span>
				<span class="font-extralight">{{ content.data.value?.subtitle }}</span>
			</h1>
		</div>

		<ContentRenderer
			v-if="content.data.value"
			class="prose max-w-3xl prose-headings:text-brand-600"
			:value="content.data.value"
		/>
	</MainContent>
</template>
