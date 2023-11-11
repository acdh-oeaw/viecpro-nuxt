<script lang="ts" setup>
import { SelectLabel, type SelectLabelProps } from "radix-vue";

const props = defineProps<SelectLabelProps>();
</script>

<template>
	<SelectLabel v-bind="props" class="py-1.5 pl-8 pr-2 text-sm font-semibold">
		<slot />
	</SelectLabel>
</template>
