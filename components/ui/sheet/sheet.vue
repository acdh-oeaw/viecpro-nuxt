<script lang="ts" setup>
import { DialogRoot, type DialogRootEmits, type DialogRootProps, useEmitAsProps } from "radix-vue";

const props = withDefaults(defineProps<DialogRootProps>(), {
	/**
	 * Vue casts optional boolean props to `false`. When we forward props to `DialogRoot`, this
	 * means that the default value of `true` will not be set there, since we are explicitly
	 * passing in `false`. This works around that.
	 *
	 * @see https://github.com/vuejs/vue/issues/4792
	 */
	modal: undefined,
});

const emit = defineEmits<DialogRootEmits>();

const emitAsProps = useEmitAsProps(emit);
</script>

<template>
	<DialogRoot v-bind="{ ...props, ...emitAsProps }">
		<slot />
	</DialogRoot>
</template>
