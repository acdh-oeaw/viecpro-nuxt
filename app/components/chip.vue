<script setup lang="ts">
defineProps<{
	square?: boolean;
}>();
</script>

<template>
	<div class="inline-block bg-slate-200 px-2 py-1" :class="square ? 'rounded' : 'rounded-full'">
		<slot />
	</div>
</template>
