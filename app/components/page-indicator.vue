<script setup lang="ts">
const route = useRoute();
defineProps<{ page: number; all: number; limit: number }>();
</script>

<template>
	<div>
		<NuxtLink v-if="page > 3" class="underline" :to="{ query: { ...route.query, page: 1 } }"
			>1</NuxtLink
		>
		<span v-if="page > 4">...</span>
		<template v-for="n in 5" :key="n - 3 + page">
			<NuxtLink
				v-if="n - 3 + page >= 1 && n - 3 + page <= Math.ceil(all / limit)"
				:class="n === 3 ? 'font-semibold' : 'underline'"
				:to="{ query: { ...route.query, page: n - 3 + page } }"
			>
				{{ n - 3 + page }}
			</NuxtLink>
		</template>
		<span v-if="page + 3 < Math.ceil(all / limit)">...</span>
		<NuxtLink
			v-if="page + 2 < Math.ceil(all / limit)"
			class="underline"
			:to="{ query: { ...route.query, page: Math.ceil(all / limit) } }"
		>
			{{ Math.ceil(all / limit) }}
		</NuxtLink>
	</div>
</template>
