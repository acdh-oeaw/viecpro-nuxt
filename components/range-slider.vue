<script lang="ts" setup>
import { Slider } from "@ark-ui/vue";
import type { ModelRef } from "vue";

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

const range: ModelRef<[number, number]> = defineModel({
	default: [0, 100] as [number, number],
});

const { Root, Control, Thumb, MarkerGroup, Marker, Range, Track } = Slider; // important
</script>

<template>
	<Root v-model="range" :min="min" :max="max" class="flex w-full flex-col gap-2">
		<div class="my-1 flex justify-between">
			<div>
				<label for="start_year" class="sr-only">Select start year</label>
				<input
					id="start_year"
					v-model="range[0]"
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
					v-model="range[1]"
					class="w-16 rounded text-right shadow"
					type="number"
					:min="min"
					:max="max"
					name="end_year"
				/>
			</div>
		</div>
		<Control class="relative flex items-center">
			<Track class="h-1 flex-1 rounded bg-slate-200">
				<Range class="h-1 rounded bg-primary-600" />
			</Track>
			<Thumb
				:key="0"
				:index="0"
				class="absolute z-10 h-4 w-4 cursor-pointer rounded-l-full rounded-r border border-primary-600 bg-white shadow"
			/>
			<Thumb
				:key="1"
				:index="1"
				class="absolute z-10 h-4 w-4 cursor-pointer rounded-l rounded-r-full border border-primary-600 bg-white shadow"
			/>
		</Control>
		<MarkerGroup class="mx-1 h-4">
			<Marker v-for="(n, i) in nMarker" :key="n" :value="min + (i * (max - min)) / (nMarker - 1)">
				<span v-if="i % 2">&#183;</span>
				<span v-else>
					{{ Math.floor(min + (i * (max - min)) / (nMarker - 1)) }}
				</span>
			</Marker>
		</MarkerGroup>
	</Root>
</template>
