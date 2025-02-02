"use client";

import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { Fragment, type ReactNode, useMemo } from "react";
import {
	Button,
	ComboBox,
	Input,
	type Key,
	Label,
	ListBox,
	ListBoxItem,
	UNSTABLE_ListLayout as ListLayout,
	Popover,
	UNSTABLE_Virtualizer as Virtualizer,
} from "react-aria-components";

import type { AutocompleteItem } from "@/app/(app)/hierarchy/_lib/autocomplete";

interface EntityComboBoxProps {
	label: ReactNode;
	legendLabels: Record<"function" | "institution" | "person", string>;
	name: string;
	options: Map<number, AutocompleteItem>;
	onSelectionChange: (key: Key | null) => void;
	selectedKey: number | null;
	triggerLabel: string;
}

export function EntityComboBox(props: EntityComboBoxProps): ReactNode {
	const { selectedKey, label, legendLabels, name, onSelectionChange, options, triggerLabel } =
		props;

	const allOptions = useMemo(() => {
		return Array.from(options.values()).slice(0, 2500);
	}, [options]);

	const layout = useMemo(() => {
		return new ListLayout({ rowHeight: 52 });
	}, []);

	return (
		<ComboBox
			allowsCustomValue={false}
			className="grid gap-y-1"
			defaultItems={allOptions}
			name={name}
			onSelectionChange={onSelectionChange}
			selectedKey={selectedKey}
		>
			<Label className="cursor-default text-xs font-bold uppercase tracking-wider text-brand-600">
				{label}
			</Label>

			<div className="relative inline-flex w-full items-center justify-between overflow-hidden rounded-md border border-brand-100 bg-white has-[disabled]:cursor-not-allowed sm:min-w-96">
				<Input className="flex-1 h-9 py-2.5 pl-4 pr-9 leading-none outline-none disabled:pointer-events-none" />
				<Button
					aria-label={triggerLabel}
					className="absolute inset-y-0 right-2 disabled:pointer-events-none"
				>
					<ChevronsUpDownIcon aria-hidden={true} className="size-4 shrink-0 text-brand-500" />
				</Button>
			</div>

			<Popover className="absolute z-10 w-[var(--trigger-width)] overflow-hidden rounded-md border border-neutral-200 bg-white text-brand-900 shadow-lg animate-in fade-in slide-in-from-top-2">
				<Virtualizer layout={layout}>
					<ListBox className="max-h-[32rem] overflow-y-auto py-2 outline-none">
						{(item: AutocompleteItem) => {
							return (
								<ListBoxItem
									className="relative flex w-full select-none items-center rounded-md pl-9 pr-6 py-1.5 hover:bg-brand-50 hover:outline-none selected:bg-brand-50 disabled:pointer-events-none disabled:text-neutral-500"
									textValue={item.label}
								>
									{({ isSelected }) => {
										return (
											<Fragment>
												{isSelected ? (
													<span className="absolute left-3 inline-flex items-center justify-center">
														<CheckIcon
															aria-hidden={true}
															className="size-4 shrink-0 text-brand-600"
														/>
													</span>
												) : null}
												<div className="grid">
													<span className="truncate">{item.label}</span>
													<span className="text-xs text-neutral-600">
														{legendLabels[item.kind]}
													</span>
												</div>
											</Fragment>
										);
									}}
								</ListBoxItem>
							);
						}}
					</ListBox>
				</Virtualizer>
			</Popover>
		</ComboBox>
	);
}
