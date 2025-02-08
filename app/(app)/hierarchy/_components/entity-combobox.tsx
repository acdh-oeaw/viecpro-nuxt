"use client";

import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { Fragment, type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import {
	Button,
	ComboBox,
	Input,
	type Key,
	Label,
	ListBox,
	ListBoxItem,
	Popover,
	useFilter,
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

	const getLabel = useCallback(
		function getLabel(id: number | null): string {
			if (id == null) return "";
			return options.get(id)?.label ?? "";
		},
		[options],
	);

	const [searchTerm, setSearchTerm] = useState(getLabel(selectedKey));
	const [menuTrigger, setMenuTrigger] = useState<"focus" | "input" | "manual" | null>(null);
	// eslint-disable-next-line @typescript-eslint/unbound-method
	const { contains } = useFilter({ sensitivity: "base" });

	// FIXME: autocomplete should filter server-side, i.e. in typesense
	const filteredOptions = useMemo(() => {
		const filteredOptions = [];

		for (const option of options.values()) {
			if (contains(option.label, searchTerm)) {
				filteredOptions.push(option);
				if (filteredOptions.length === 10) break;
			}
		}

		return filteredOptions;
	}, [options, searchTerm, contains]);

	/**
	 * When a user clicks a node in the visualisation, the selectedKey will change and we need to
	 * sync the input value of the controlled combobox.
	 */
	useEffect(() => {
		setSearchTerm(getLabel(selectedKey));
	}, [selectedKey, getLabel]);

	return (
		<ComboBox
			allowsCustomValue={false}
			className="grid gap-y-1"
			inputValue={searchTerm}
			items={menuTrigger === "manual" ? Array.from(options.values()).slice(0, 10) : filteredOptions}
			name={name}
			onInputChange={(searchTerm) => {
				setSearchTerm(searchTerm);
				setMenuTrigger("input");
			}}
			onOpenChange={(_isOpen, menuTrigger) => {
				setMenuTrigger(menuTrigger ?? null);
			}}
			onSelectionChange={(id: Key | null) => {
				onSelectionChange(id);
				setSearchTerm(getLabel(id as number | null));
			}}
			selectedKey={selectedKey}
		>
			<Label className="cursor-default text-xs font-bold uppercase tracking-wider text-brand-600">
				{label}
			</Label>

			<div className="relative inline-flex w-full items-center justify-between overflow-hidden rounded-md border border-brand-100 bg-white has-[disabled]:cursor-not-allowed sm:min-w-96 focus-within:focus-outline focus-within:focus-outline-offset-0">
				<Input className="flex-1 py-2.5 pl-4 pr-9 leading-none outline-none disabled:pointer-events-none" />
				<Button
					aria-label={triggerLabel}
					className="absolute inset-y-0 right-2 disabled:pointer-events-none"
				>
					<ChevronsUpDownIcon aria-hidden={true} className="size-5 shrink-0 text-brand-500" />
				</Button>
			</div>

			<Popover className="absolute z-10 w-[var(--trigger-width)] overflow-hidden rounded-md border border-neutral-200 bg-white text-brand-900 shadow-lg animate-in fade-in slide-in-from-top-2">
				<ListBox className="max-h-[32rem] overflow-y-auto py-2 outline-none">
					{(item: AutocompleteItem) => {
						return (
							<ListBoxItem
								className="relative flex w-full select-none items-center rounded-md px-8 py-2 hover:bg-brand-50 hover:outline-none selected:bg-brand-50 disabled:pointer-events-none disabled:text-neutral-500 focus-visible:bg-brand-50"
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
