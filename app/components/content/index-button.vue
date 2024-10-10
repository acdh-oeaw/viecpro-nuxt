<script lang="ts" setup>
defineProps<{
	href?: string;
}>();
</script>

<template>
	<div class="mx-auto text-center">
		<a
			class="inline-block rounded border bg-gray-300 px-4 py-2 font-sans uppercase text-gray-600 no-underline transition hover:bg-gray-400 hover:text-gray-800 active:bg-gray-500"
			:href="href"
		>
			<slot />
		</a>
	</div>
</template>
