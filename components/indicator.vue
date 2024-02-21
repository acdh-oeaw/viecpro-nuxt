<script lang="ts" setup>
defineProps<{
	status: string;
}>();
</script>

<template>
	<div class="flex gap-1 rounded border p-2">
		<div :class="status === 'red' && 'bg-red-500'" class="h-6 w-6 rounded-full bg-slate-300" />
		<div
			:class="status === 'yellow' && 'bg-yellow-500'"
			class="h-6 w-6 rounded-full bg-slate-300"
		/>
		<div :class="status === 'green' && 'bg-green-500'" class="h-6 w-6 rounded-full bg-slate-300" />
	</div>
</template>
