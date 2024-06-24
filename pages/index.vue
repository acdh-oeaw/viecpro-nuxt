<script lang="ts" setup>
defineRouteRules({
	prerender: true,
});

const locale = useLocale();

definePageMeta({
	title: "pages.home.title",
});
</script>

<template>
	<MainContent class="mb-4 flex flex-col gap-8 md:mb-8">
		<div class="flex flex-col gap-8 md:gap-32">
			<div>
				<div class="h-2 w-full bg-primary-900" />
				<NuxtImg
					:placeholder="[452, 128, 75]"
					src="/assets/images/background-court-ship.jpg"
					alt=""
					format="webp"
					class="aspect-[3.84] min-h-80 w-full object-cover"
				/>
				<div class="h-2 w-full bg-primary-800" />
			</div>
			<ContentDoc v-slot="{ doc }" path="/landing-page" :where="{ _locale: locale }">
				<ContentRenderer v-if="doc" :value="doc">
					<ContentRendererMarkdown :value="doc" />
				</ContentRenderer>
			</ContentDoc>
		</div>
	</MainContent>
</template>
