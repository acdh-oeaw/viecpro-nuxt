"use client";

import { Fragment, type ReactNode } from "react";
import { Label, Slider, SliderOutput, SliderThumb, SliderTrack } from "react-aria-components";

import type { SearchFilters } from "@/app/(app)/search/persons/_lib/search";

interface SearchDateRangeSliderProps {
	defaultValue: [number, number];
	label: string;
	maxValue: number;
	minValue: number;
	names: [keyof SearchFilters, keyof SearchFilters];
	onChange: (values: [number, number]) => void;
	thumbLabels: [string, string];
}

export function SearchDateRangeSlider(props: SearchDateRangeSliderProps): ReactNode {
	const { defaultValue, label, maxValue, minValue, names, onChange, thumbLabels } = props;

	return (
		<Slider
			defaultValue={defaultValue}
			formatOptions={{ notation: "compact" }}
			maxValue={maxValue}
			minValue={minValue}
			onChangeEnd={onChange}
		>
			<div className="flex items-center justify-between gap-x-2">
				<Label className="text-xs font-bold tracking-wider text-brand-600 uppercase">{label}</Label>
				<SliderOutput className="text-xs font-medium text-brand-600">
					{({ state }) => {
						return state.values
							.map((_, index) => {
								return state.getThumbValueLabel(index);
							})
							.join(" – ");
					}}
				</SliderOutput>
			</div>
			<SliderTrack className="relative h-5 w-full">
				{({ state }) => {
					return (
						<Fragment>
							<div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-brand-600" />
							<div
								className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-brand-100"
								style={{ width: `${String(state.getThumbPercent(0) * 100)}%` }}
							/>
							<div
								className="absolute top-1/2 right-0 h-1 -translate-y-1/2 rounded-full bg-brand-100"
								style={{ width: `${String(100 - state.getThumbPercent(1) * 100)}%` }}
							/>
							{state.values.map((_, index) => {
								return (
									<SliderThumb
										key={index}
										aria-label={thumbLabels[index]}
										className="top-1/2 size-5 rounded-full border border-brand-300 bg-brand-50 shadow-md transition focus-visible:outline-2 focus-visible:outline-brand-600 focus-visible:outline-solid dragging:border-brand-600"
										index={index}
										name={names[index]}
									/>
								);
							})}
						</Fragment>
					);
				}}
			</SliderTrack>
		</Slider>
	);
}
