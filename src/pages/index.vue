<script lang="ts" setup>
definePageMeta({
	title: "IndexPage.meta.title",
});

const locale = useLocale();
const _t = useTranslations("IndexPage");

const content = await useAsyncData(["home", locale].join("+"), () => {
	return queryContent("/home").locale(locale.value).findOne();
});
</script>

<template>
	<MainContent>
		<div>
			<img
				alt=""
				class="w-full border-b-8 border-primary-background object-cover"
				:height="500"
				src="/assets/images/hero.jpg"
				:width="1920"
			/>
		</div>

		<div class="container grid content-start gap-12 py-16">
			<div class="flex gap-2 text-primary-foreground">
				<h1 class="text-4xl font-extrabold">
					{{ content.data.value?.title }}
					<span aria-hidden="true">.</span>
				</h1>
				<h2 class="text-4xl font-extralight">{{ content.data.value?.subtitle }}</h2>
			</div>

			<ContentRenderer
				v-if="content.data.value"
				class="prose max-w-3xl"
				:value="content.data.value"
			/>
		</div>
	</MainContent>
</template>
