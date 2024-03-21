<script lang="ts" setup>
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from "radix-vue";

defineProps({
	min: {
		type: Number,
		default: 0,
		validator(value: number, propsEnt: { min: number; max: number }) {
			return value <= propsEnt.max;
		},
	},
	max: {
		type: Number,
		default: 100,
		validator(value: number, propsEnt: { min: number; max: number }) {
			return value >= propsEnt.max;
		},
	},
	nMarker: {
		type: Number,
		default: 7,
	},
});

const sliderValue = defineModel<[number, number]>({
	default: [0, 100],
});
</script>

<template>
	<div class="flex flex-col gap-2">
		<div class="my-1 flex justify-between">
			<div>
				<label for="start_year" class="sr-only">Select start year</label>
				<input
					id="start_year"
					v-model="sliderValue[0]"
					class="w-16 rounded shadow md:text-right"
					type="number"
					:min="min"
					:max="max"
					name="start_year"
				/>
			</div>
			<div>
				<label for="end_year" class="sr-only">Select end year</label>
				<input
					id="end_year"
					v-model="sliderValue[1]"
					class="w-16 rounded text-right shadow"
					type="number"
					:min="min"
					:max="max"
					name="end_year"
				/>
			</div>
		</div>
		<SliderRoot
			v-model="sliderValue"
			class="relative flex h-5 w-full touch-none select-none items-center"
			:max="max"
			:min="min"
		>
			<SliderTrack class="relative h-1 grow rounded bg-slate-200">
				<SliderRange class="absolute h-full rounded bg-primary-600" />
			</SliderTrack>
			<SliderThumb
				class="block h-5 w-5 rounded-l-full border border-primary-600 bg-white shadow hover:bg-primary-200 active:bg-primary-300"
			/>
			<SliderThumb
				class="block h-5 w-5 rounded-r-full border border-primary-600 bg-white shadow hover:bg-primary-200 active:bg-primary-300"
			/>
		</SliderRoot>
		<div class="flex justify-between">
			<div v-for="n in nMarker" :key="n">
				<span v-if="n % 2 === 0">&#183;</span>
				<span v-else>{{ Math.floor(min + ((n - 1) * (max - min)) / (nMarker - 1)) }}</span>
			</div>
		</div>
	</div>
</template>
