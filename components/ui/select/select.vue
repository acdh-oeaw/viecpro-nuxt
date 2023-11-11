<script lang="ts" setup>
import { SelectRoot, type SelectRootEmits, type SelectRootProps, useEmitAsProps } from "radix-vue";

const props = defineProps<SelectRootProps>();

const emit = defineEmits<SelectRootEmits>();

const emitsAsProps = useEmitAsProps(emit);
</script>

<template>
	<SelectRoot v-bind="{ ...props, ...emitsAsProps }">
		<slot />
	</SelectRoot>
</template>
