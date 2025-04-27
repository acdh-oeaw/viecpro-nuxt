"use client";

import { ChevronDownIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button, Disclosure, DisclosurePanel, Heading } from "react-aria-components";

interface CollapsibleProps {
	children: ReactNode;
	defaultExpanded?: boolean;
	isDisabled?: boolean;
	label: ReactNode;
}

export function Collapsible(props: CollapsibleProps): ReactNode {
	const { children, defaultExpanded, isDisabled, label } = props;

	return (
		<Disclosure
			className="group grid gap-y-3"
			defaultExpanded={defaultExpanded}
			isDisabled={isDisabled}
		>
			<Heading>
				<Button
					className="group inline-flex w-full cursor-pointer items-center justify-between rounded-md border border-brand-200 bg-brand-100 px-3 py-2 font-medium text-brand-900 transition group-expanded:border-brand-300 group-expanded:bg-brand-200 hover:border-brand-300 hover:bg-brand-200 focus-visible:focus-outline focus-visible:focus-outline-offset-0 disabled:cursor-not-allowed disabled:border-neutral-200 disabled:bg-transparent disabled:text-neutral-500"
					slot="trigger"
				>
					{label}
					<ChevronDownIcon
						aria-hidden={true}
						className="size-5 shrink-0 text-brand-600 transition group-disabled:text-neutral-400 group-expanded:rotate-180"
					/>
				</Button>
			</Heading>
			<DisclosurePanel className="min-w-0">{children}</DisclosurePanel>
		</Disclosure>
	);
}
