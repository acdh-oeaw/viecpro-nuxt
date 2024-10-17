<script lang="ts" setup>
defineProps<{
	status?: string;
	small?: boolean;
}>();
</script>

<template>
	<div class="flex gap-1 border" :class="!small ? 'rounded p-2' : 'rounded-full'">
		<div
			v-if="small"
			class="size-full rounded-full"
			:class="{
				'bg-red-400': status === 'red',
				'bg-yellow-400': status === 'yellow',
				'bg-green-400': status === 'green',
				'bg-slate-300': !['red', 'yellow', 'green'].includes(String(status)),
			}"
		/>
		<template v-else>
			<div
				class="aspect-square w-1/3 rounded-full"
				:class="status === 'red' ? 'bg-red-500' : 'bg-slate-300'"
			/>
			<div
				class="aspect-square w-1/3 rounded-full"
				:class="status === 'yellow' ? 'bg-yellow-500' : 'bg-slate-300'"
			/>
			<div
				class="aspect-square w-1/3 rounded-full"
				:class="status === 'green' ? 'bg-green-500' : 'bg-slate-300'"
			/>
		</template>
	</div>
</template>
