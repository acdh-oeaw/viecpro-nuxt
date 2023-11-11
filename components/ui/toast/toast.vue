<script lang="ts" setup>
import { cva, type VariantProps } from "cva";
import { ToastRoot, type ToastRootEmits, type ToastRootProps, useEmitAsProps } from "radix-vue";

const styles = cva({
	base: "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
	variants: {
		variant: {
			default: "border bg-background text-on-background",
			negative: "group border-negative bg-negative text-on-negative",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

const props = defineProps<
	ToastRootProps & {
		variant: VariantProps<typeof styles>["variant"];
	}
>();

const emit = defineEmits<ToastRootEmits>();

const emitAsProps = useEmitAsProps(emit);
</script>

<template>
	<ToastRoot
		v-bind="{ ...props, ...emitAsProps }"
		:class="styles({ variant: props.variant })"
		:data-variant="props.variant"
	>
		<slot />
	</ToastRoot>
</template>
