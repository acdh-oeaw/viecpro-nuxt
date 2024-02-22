<script lang="ts" setup>
defineProps<{
	status: string;
}>();
</script>

<template>
	<div class="flex gap-1 rounded border p-2">
		<div
			:class="status === 'red' ? 'bg-red-500' : 'bg-slate-300'"
			class="aspect-square w-1/3 rounded-full"
		/>
		<div
			:class="status === 'yellow' ? 'bg-yellow-500' : 'bg-slate-300'"
			class="aspect-square w-1/3 rounded-full"
		/>
		<div
			:class="status === 'green' ? 'bg-green-500' : 'bg-slate-300'"
			class="aspect-square w-1/3 rounded-full"
		/>
	</div>
</template>
