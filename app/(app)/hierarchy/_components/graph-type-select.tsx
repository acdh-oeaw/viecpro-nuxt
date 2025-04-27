"use client";

import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { Fragment, type ReactNode } from "react";
import {
	Button,
	type Key,
	Label,
	ListBox,
	ListBoxItem,
	Popover,
	Select,
	SelectValue,
} from "react-aria-components";

interface GraphTypeSelectProps {
	isDisabled: boolean;
	label: ReactNode;
	name: string;
	onSelectionChange: (key: Key | null) => void;
	options: Array<{ id: string; label: string }>;
	placeholder: string;
	selectedKey: string;
}

export function GraphTypeSelect(props: GraphTypeSelectProps): ReactNode {
	const { isDisabled, label, name, onSelectionChange, options, placeholder, selectedKey } = props;

	return (
		<Select
			className="grid gap-y-1"
			isDisabled={isDisabled}
			name={name}
			onSelectionChange={onSelectionChange}
			placeholder={placeholder}
			selectedKey={selectedKey}
		>
			<Label className="cursor-default text-xs font-bold tracking-wider text-brand-600 uppercase">
				{label}
			</Label>

			<Button className="inline-flex w-full items-center justify-between gap-x-2.5 rounded-md border border-brand-100 bg-white py-2.5 pr-3 pl-4 leading-none focus-visible:focus-outline focus-visible:focus-outline-offset-0 disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-96">
				<SelectValue className="placeholder-shown:text-neutral-500" />
				<ChevronDownIcon aria-hidden={true} className="size-4 shrink-0 text-brand-500" />
			</Button>

			<Popover className="absolute z-10 w-[var(--trigger-width)] overflow-hidden rounded-md border border-neutral-200 bg-white text-brand-900 shadow-lg animate-in fade-in slide-in-from-top-2">
				<ListBox className="py-2 outline-none" items={options}>
					{(item) => {
						return (
							<ListBoxItem
								className="relative flex w-full items-center rounded-md px-8 py-2 select-none hover:bg-brand-50 hover:outline-none focus-visible:bg-brand-50 disabled:pointer-events-none disabled:text-neutral-500 selected:bg-brand-50"
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
											{item.label}
										</Fragment>
									);
								}}
							</ListBoxItem>
						);
					}}
				</ListBox>
			</Popover>
		</Select>
	);
}
