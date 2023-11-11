<script lang="ts" setup>
defineProps<{
	loading: boolean;
	data: object;
	target?: object;
	source?: object;
}>();
</script>

<template>
	<div class="h-full">
		<div v-if="!loading">
			<div>
				<h1 class="text-2xl">Entity:</h1>
				<pre>
					{{ data }}
				</pre
				>
			</div>
			<div v-if="source">
				<h1 class="text-2xl">Relations with entity as source:</h1>
				<pre>
					{{ source }}
				</pre
				>
			</div>
			<div v-if="target">
				<h1 class="text-2xl">Relations with entity as target:</h1>
				<pre>
					{{ target }}
				</pre
				>
			</div>
		</div>
		<Centered v-else>
			<LoadingIndicator size="lg" />
		</Centered>
	</div>
</template>
