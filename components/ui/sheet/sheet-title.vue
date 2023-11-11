<script lang="ts" setup>
import { DialogTitle, type DialogTitleProps } from "radix-vue";

const props = defineProps<DialogTitleProps>();
</script>

<template>
	<DialogTitle v-bind="props" class="text-lg font-semibold text-on-background">
		<slot />
	</DialogTitle>
</template>
