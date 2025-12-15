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
	ListLayout,
	Popover,
	useFilter,
	Virtualizer,
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
		return Array.from(options.values());
	}, [options]);

	// eslint-disable-next-line @typescript-eslint/unbound-method
	const { contains } = useFilter();

	return (
		<ComboBox
			allowsCustomValue={false}
			className="grid gap-y-1"
			defaultFilter={contains}
			defaultItems={allOptions}
			name={name}
			onSelectionChange={onSelectionChange}
			selectedKey={selectedKey}
		>
			<Label className="cursor-default text-xs font-bold tracking-wider text-brand-600 uppercase">
				{label}
			</Label>

			<div className="relative inline-flex w-full items-center justify-between overflow-hidden rounded-md border border-brand-100 bg-white focus-within:focus-outline focus-within:focus-outline-offset-0 has-[disabled]:cursor-not-allowed sm:min-w-96">
				<Input className="flex-1 py-2.5 pr-9 pl-4 leading-none outline-none disabled:pointer-events-none" />
				<Button
					aria-label={triggerLabel}
					className="absolute inset-y-0 right-2 disabled:pointer-events-none"
				>
					<ChevronsUpDownIcon aria-hidden={true} className="size-4 shrink-0 text-brand-500" />
				</Button>
			</div>

			<Popover className="absolute z-10 w-(--trigger-width) overflow-hidden rounded-md border border-neutral-200 bg-white text-brand-900 shadow-lg animate-in fade-in slide-in-from-top-2">
				<Virtualizer
					layout={ListLayout}
					layoutOptions={{
						rowHeight: 52,
					}}
				>
					<ListBox className="max-h-128 overflow-y-auto py-2 outline-none">
						{(item: AutocompleteItem) => {
							return (
								<ListBoxItem
									className="relative flex w-full items-center rounded-md px-8 py-2 select-none hover:bg-brand-50 hover:outline-none focus-visible:bg-brand-50 disabled:pointer-events-none disabled:text-neutral-500 selected:bg-brand-50"
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
