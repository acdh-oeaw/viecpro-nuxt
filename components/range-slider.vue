<script lang="ts" setup>
import { Slider } from "@ark-ui/vue";

const emit = defineEmits<{
	change: [value: Array<number>];
}>();

const t = useTranslations();

const range = ref([1700, 1900]);

const { Root, Label: Sliderlabel, Control, Thumb, MarkerGroup, Marker, Range, Track } = Slider; // important

watch(range, (from, to) => {
	emit("change", to);
});
</script>

<template>
	<Root v-model="range" :min="1700" :max="1900" class="flex flex-col gap-2">
		<Sliderlabel>{{ t("ui.timespan") }}</Sliderlabel>
		<div class="my-1 flex justify-between">
			<div>
				<label for="start_year" class="sr-only">Select start year</label>
				<input
					id="start_year"
					v-model="range[0]"
					class="w-16 rounded border text-right"
					type="number"
					:min="1700"
					:max="1900"
					name="start_year"
					@input="
						(event: Event) =>
							(range = [(event.target as HTMLInputElement).valueAsNumber, Number(range[1])])
					"
				/>
			</div>
			<div>
				<label for="end_year" class="sr-only">Select end year</label>
				<input
					id="end_year"
					v-model="range[1]"
					class="w-16 rounded border text-right"
					type="number"
					:min="1700"
					:max="1900"
					name="end_year"
					@input="
						(event: Event) =>
							(range = [Number(range[0]), (event.target as HTMLInputElement).valueAsNumber])
					"
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
				class="absolute h-4 w-4 cursor-pointer rounded-l-full border border-primary-600 bg-white"
			/>
			<Thumb
				:key="1"
				:index="1"
				class="h-4 w-4 cursor-pointer rounded-r-full border border-primary-600 bg-white"
			/>
		</Control>
		<MarkerGroup class="h-40">
			<Marker :value="1700" class="text-slate-400">1700</Marker>
			<Marker :value="1750" class="text-slate-400">&#183;</Marker>
			<Marker :value="1800" class="text-slate-400">1800</Marker>
			<Marker :value="1850" class="text-slate-400">&#183;</Marker>
			<Marker :value="1900" class="text-slate-400">1900</Marker>
		</MarkerGroup>
	</Root>
</template>
