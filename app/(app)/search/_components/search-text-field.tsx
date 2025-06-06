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
			<Label className="text-xs font-bold tracking-wider text-brand-600 uppercase">{label}</Label>
			<div className="relative">
				<Input className="w-full border border-brand-100 bg-white py-1.5 pr-9 pl-3 focus-visible:focus-outline focus-visible:focus-outline-offset-0" />
				<Button className="absolute inset-y-0 right-3 group-empty:hidden">
					<XIcon aria-hidden={true} className="size-4 text-brand-600" />
				</Button>
			</div>
		</SearchField>
	);
}
