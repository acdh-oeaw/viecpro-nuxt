<script lang="ts" setup>
defineRouteRules({
	prerender: true,
});

const t = useTranslations();

usePageMetadata({
	title: t("IndexPage.meta.title"),
});
</script>

<template>
	<MainContent class="mb-4 flex flex-col gap-8 md:mb-8">
		<div class="flex flex-col gap-8 md:gap-32">
			<div>
				<div class="h-2 w-full bg-primary-900" />
				<NuxtImg
					alt=""
					class="aspect-[3.84] min-h-80 w-full object-cover"
					format="webp"
					:placeholder="[452, 128, 75]"
					src="/assets/images/hero.jpg"
				/>
				<div class="h-2 w-full bg-primary-800" />
			</div>
			<ContentDoc v-slot="{ doc }" path="landing-page">
				<ContentRenderer v-if="doc" :value="doc">
					<ContentRendererMarkdown :value="doc" />
				</ContentRenderer>
			</ContentDoc>
		</div>
	</MainContent>
</template>
