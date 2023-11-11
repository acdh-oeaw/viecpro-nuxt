<script lang="ts" setup>
import { cva } from "cva";
import { XIcon } from "lucide-vue-next";
import {
	DialogClose,
	DialogContent,
	type DialogContentEmits,
	type DialogContentProps,
	DialogOverlay,
	DialogPortal,
	useEmitAsProps,
} from "radix-vue";

interface SheetContentProps extends DialogContentProps {
	side?: "bottom" | "left" | "right" | "top";
}

const props = defineProps<SheetContentProps>();

const emit = defineEmits<DialogContentEmits>();

const emitAsProps = useEmitAsProps(emit);

const styles = cva({
	base: "fixed z-50 gap-4 bg-background p-6 shadow-lg transition-transform ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out",
	variants: {
		side: {
			top: "inset-x-0 top-0 border-b border-border data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
			bottom:
				"inset-x-0 bottom-0 border-t border-border data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
			left: "inset-y-0 left-0 h-full w-3/4 border-r border-border data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
			right:
				"inset-y-0 right-0 h-full w-3/4 border-l border-border data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
		},
	},
	defaultVariants: {
		side: "right",
	},
});
</script>

<template>
	<DialogPortal>
		<DialogOverlay
			class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
		/>
		<DialogContent
			v-bind="{ ...props, ...emitAsProps }"
			:class="styles({ side: props.side, class: $attrs.class as string | undefined })"
		>
			<slot />

			<DialogClose
				class="focus-visible:ring-ring absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
			>
				<XIcon class="h-4 w-4" />
			</DialogClose>
		</DialogContent>
	</DialogPortal>
</template>
