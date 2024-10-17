<script lang="ts" setup>
const isVisible = import.meta.dev;
</script>

<template>
	<div
		v-if="isVisible"
		class="fixed bottom-1 left-1 z-10 grid size-8 place-content-center rounded-full bg-black p-2 font-mono text-xs font-medium text-white"
	>
		<span class="sm:hidden">xs</span>
		<span class="max-sm:hidden md:hidden">sm</span>
		<span class="max-md:hidden lg:hidden">md</span>
		<span class="max-lg:hidden xl:hidden">lg</span>
		<span class="max-xl:hidden 2xl:hidden">xl</span>
		<span class="max-2xl:hidden">2xl</span>
	</div>
</template>
