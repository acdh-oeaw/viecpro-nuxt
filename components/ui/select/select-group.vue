<script lang="ts" setup>
import { SelectGroup, type SelectGroupProps } from "radix-vue";

const props = defineProps<SelectGroupProps>();
</script>

<template>
	<SelectGroup v-bind="props" class="w-full p-1">
		<slot />
	</SelectGroup>
</template>
