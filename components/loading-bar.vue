<script setup lang="ts">
defineProps<{
	color?: string;
	disabled?: boolean;
}>();
</script>

<template>
	<div class="relative w-full overflow-hidden">
		<div v-if="!disabled">
			<div
				class="absolute h-full animate-loadingBar"
				:style="{ backgroundColor: color ?? 'black' }"
			/>
			<div
				class="absolute h-full animate-loadingBar delay-2s"
				:style="{ backgroundColor: color ?? 'black' }"
			/>
		</div>
	</div>
</template>
