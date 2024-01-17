<script lang="ts" setup>
const locale = useLocale();

definePageMeta({
	title: "pages.home.title",
});
</script>

<template>
	<MainContent class="mb-4 flex flex-col gap-8 md:mb-8">
		<div class="flex flex-col gap-16 md:gap-32">
			<div>
				<div class="h-2 w-full bg-primary-900" />
				<img
					src="/assets/images/background-court-ship.jpeg"
					alt=""
					class="min-h-[20rem] w-full object-cover"
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
