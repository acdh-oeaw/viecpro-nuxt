<script lang="ts" setup>
import {
	Select,
	SelectContent,
	SelectLabel,
	SelectOption,
	SelectPositioner,
	type SelectProps,
	SelectTrigger,
} from "@ark-ui/vue";
import { ChevronDown as SelectIcon } from "lucide-vue-next";

// FIXME: import { type SelectOptionProps } from "@ark-ui/vue" does not properly resolve.
export type OptionProps = { value: string; label: string; disabled?: boolean; valueText?: string };
export type Option = Pick<OptionProps, "label" | "value">;

interface SingleSelectProps {
	label: string;
	placeholder: string;
	options: Array<OptionProps>;
	selectedOption: Option | null | undefined;
}

const props = defineProps<SingleSelectProps>();

const emit = defineEmits<{
	(event: "selection-change", option: Option | null): void;
}>();

function onSelectionChange(option: Option | null) {
	emit("selection-change", option);
}
</script>

<template>
	<!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
	<Select
		v-slot="{ highlightedOption, isOpen, selectedOption }"
		:selected-option="props.selectedOption"
		@change="onSelectionChange"
	>
		<div class="inline-grid gap-1">
			<SelectLabel>{{ props.label }}</SelectLabel>
			<SelectTrigger>
				<button
					class="inline-flex items-center justify-between gap-2 rounded border border-neutral-200 px-3 py-2"
				>
					<span>{{ selectedOption?.label ?? props.placeholder }}</span>
					<SelectIcon class="h-5 w-5 shrink-0 transition" :class="{ 'rotate-180': isOpen }" />
				</button>
			</SelectTrigger>
		</div>
		<Teleport to="body">
			<SelectPositioner class="rounded border border-neutral-200 bg-white py-2 shadow-md">
				<SelectContent>
					<SelectOption
						v-for="option of options"
						:key="option.value"
						v-bind="option"
						class="select-none px-3 py-1.5 transition"
						:class="{ 'bg-neutral-200': option.value === highlightedOption?.value }"
					/>
				</SelectContent>
			</SelectPositioner>
		</Teleport>
	</Select>
</template>
