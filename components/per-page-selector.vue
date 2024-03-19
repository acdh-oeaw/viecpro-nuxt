<script setup lang="ts">
const t = useTranslations();
const route = useRoute();
</script>

<template>
	<div>
		<span>{{ t("ui.per-page") }}:</span>
		<NuxtLink
			v-for="option in [10, 25, 50, 100]"
			:key="option"
			:class="
				(!route.query.limit && option === 25) || option === Number(route.query.limit)
					? 'font-semibold'
					: 'underline'
			"
			:to="{
				query: {
					...route.query,
					page: 1,
					limit: option,
				},
			}"
		>
			{{ option }}
		</NuxtLink>
	</div>
</template>
