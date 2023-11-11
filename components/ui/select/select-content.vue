<script lang="ts" setup>
import {
	SelectContent,
	type SelectContentEmits,
	type SelectContentProps,
	SelectPortal,
	SelectViewport,
	useForwardPropsEmits,
} from "radix-vue";

const props = withDefaults(defineProps<SelectContentProps>(), {
	position: "popper",
	sideOffset: 4,
});

const emit = defineEmits<SelectContentEmits>();

const forwarded = useForwardPropsEmits(props, emit);
</script>

<template>
	<SelectPortal>
		<SelectContent
			v-bind="{ ...forwarded, ...$attrs }"
			:class="[
				'relative z-50 min-w-[10rem] overflow-hidden rounded-md border border-border bg-background text-on-background shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
				position === 'popper' &&
					'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
			]"
		>
			<SelectViewport
				:class="[
					'p-1',
					position === 'popper' &&
						'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
				]"
			>
				<slot />
			</SelectViewport>
		</SelectContent>
	</SelectPortal>
</template>
