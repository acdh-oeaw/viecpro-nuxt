<script lang="ts" setup>
const visContainer = ref<HTMLElement | null>(null);
const dimensions = ref<DOMRect | null>(null);

const observer = new ResizeObserver((entries) => {
	const [entry] = entries;
	if (entry == null) return;
	dimensions.value = entry.contentRect;
});

onMounted(() => {
	if (visContainer.value == null) return;
	observer.observe(visContainer.value);
});

onUnmounted(() => {
	observer.disconnect();
});
</script>

<template>
	<div ref="visContainer" class="h-full w-full">
		<slot v-if="dimensions" :width="dimensions.width" :height="dimensions.height" />
	</div>
</template>
