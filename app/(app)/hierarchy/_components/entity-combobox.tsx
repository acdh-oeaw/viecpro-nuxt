"use client";

import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { Fragment, type ReactNode, useMemo, useState } from "react";
import {
	Button,
	ComboBox,
	Input,
	type Key,
	Label,
	ListBox,
	ListBoxItem,
	Popover,
} from "react-aria-components";

import type { AutocompleteItem } from "@/app/(app)/hierarchy/_lib/autocomplete";

interface EntityComboBoxProps {
	selectedKey: number | undefined;
	label: ReactNode;
	legendLabels: Record<"function" | "institution" | "person", string>;
	name: string;
	options: Map<number, AutocompleteItem>;
	onSelectionChange: (key: Key | null) => void;
	triggerLabel: string;
}

export function EntityComboBox(props: EntityComboBoxProps): ReactNode {
	const { selectedKey, label, legendLabels, name, onSelectionChange, options, triggerLabel } =
		props;

	const [searchTerm, setSearchTerm] = useState(
		selectedKey ? (options.get(selectedKey)?.label ?? "") : "",
	);

	// FIXME: autocomplete should filter server-side, i.e. in typesense
	const filteredOptions = useMemo(() => {
		const segments = searchTerm.trim().split(/\s+/);

		const max = 10;

		const filtered = [];

		for (const option of options.values()) {
			if (
				segments.length === 0 ||
				segments.some((segment) => {
					return option.label.toLowerCase().includes(segment.toLowerCase());
				})
			) {
				filtered.push(option);
			}

			if (filtered.length === max) {
				break;
			}
		}

		return filtered;
	}, [searchTerm, options]);

	return (
		<ComboBox
			allowsCustomValue={false}
			className="grid gap-y-1"
			inputValue={searchTerm}
			items={filteredOptions}
			name={name}
			onInputChange={setSearchTerm}
			onSelectionChange={onSelectionChange}
			selectedKey={selectedKey}
		>
			<Label className="cursor-default text-xs font-bold uppercase tracking-wider text-brand-600">
				{label}
			</Label>

			<div className="relative inline-flex w-full min-w-96 items-center justify-between overflow-hidden rounded-md border border-brand-100 bg-white has-[disabled]:cursor-not-allowed">
				<Input className="flex-1 py-2.5 pl-4 pr-9 leading-none outline-none disabled:pointer-events-none" />
				<Button
					aria-label={triggerLabel}
					className="absolute inset-y-0 right-2 disabled:pointer-events-none"
				>
					<ChevronsUpDownIcon aria-hidden={true} className="size-5 shrink-0 text-brand-500" />
				</Button>
			</div>

			<Popover className="absolute z-10 min-w-[--trigger-width] overflow-hidden rounded-md border border-neutral-200 bg-white text-brand-900 shadow-lg animate-in fade-in slide-in-from-top-2">
				<ListBox className="max-h-96 overflow-y-auto py-2 outline-none">
					{(item: AutocompleteItem) => {
						return (
							<ListBoxItem
								className="relative flex w-full select-none items-center rounded-md px-8 py-2 hover:bg-brand-50 hover:outline-none selected:bg-brand-50 disabled:pointer-events-none disabled:text-neutral-500"
								textValue={item.label}
							>
								{({ isSelected }) => {
									return (
										<Fragment>
											{isSelected ? (
												<span className="absolute left-2 inline-flex items-center justify-center">
													<CheckIcon
														aria-hidden={true}
														className="size-4 shrink-0 text-brand-600"
													/>
												</span>
											) : null}
											<div className="grid">
												<span>{item.label}</span>
												<span className="text-xs text-neutral-600">{legendLabels[item.kind]}</span>
											</div>
										</Fragment>
									);
								}}
							</ListBoxItem>
						);
					}}
				</ListBox>
			</Popover>
		</ComboBox>
	);
}
