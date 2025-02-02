"use client";

import { XIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button, Input, Label, SearchField } from "react-aria-components";

interface SearchTextFieldProps {
	label: ReactNode;
	name: string;
	onChange: (value: string) => void;
	value: string;
}

export function SearchTextField(props: SearchTextFieldProps): ReactNode {
	const { name, label, onChange, value } = props;

	return (
		<SearchField className="group grid gap-y-2" name={name} onChange={onChange} value={value}>
			<Label className="text-xs font-bold uppercase tracking-wider text-brand-600">{label}</Label>
			<div className="relative">
				<Input className="w-full border border-brand-100 py-1.5 pl-3 pr-9 bg-white" />
				<Button className="absolute inset-y-0 right-3 group-empty:hidden">
					<XIcon aria-hidden={true} className="size-4 text-brand-600" />
				</Button>
			</div>
		</SearchField>
	);
}
