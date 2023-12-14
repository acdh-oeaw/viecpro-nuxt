<script lang="ts" setup>
const t = useTranslations();

defineProps<{
	model: string;
}>();
</script>

<template>
	<div class="mx-auto h-full w-full max-w-container px-2 py-4 xl:px-0">
		<h2 class="text-lg text-gray-500 lg:text-2xl">{{ t("detail-page.basedata") }} - {{ model }}</h2>
		<slot name="head" />
		<div class="mt-4 grid gap-16 md:grid-cols-[2fr_3fr]">
			<div class="flex flex-col gap-8">
				<div>
					<h2 class="text-2xl text-gray-500">{{ t("detail-page.basedata") }}</h2>
					<div class="grid grid-cols-2">
						<slot name="base" />
					</div>
				</div>
				<slot name="left" />
			</div>
			<slot name="right" />
		</div>
	</div>
</template>
