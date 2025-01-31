"use client";

import type { ReactNode } from "react";

import type { SearchFilters } from "@/app/(app)/search/persons/_lib/search";

interface SearchEmptyDateCheckboxProps {
	checked: boolean;
	label: ReactNode;
	name: keyof SearchFilters;
	onChange: (isSeleced: boolean) => void;
}

export function SearchEmptyDateCheckbox(props: SearchEmptyDateCheckboxProps): ReactNode {
	const { checked, label, name, onChange } = props;

	return (
		<label className="inline-flex items-center gap-x-1.5 text-xs font-medium text-brand-600 accent-brand-600">
			<input
				checked={checked}
				name={name}
				onChange={(event) => {
					onChange(event.currentTarget.checked);
				}}
				type="checkbox"
				value="include"
			/>
			<span>{label}</span>
		</label>
	);
}
