"use client";

import type { ReactNode } from "react";
import { Button, Dialog, DialogTrigger, OverlayArrow, Popover } from "react-aria-components";

import { Tooltip, TooltipTrigger } from "@/components/tooltip";

interface PopoverNoteProps {
	children: ReactNode;
	isDisabled?: boolean;
	label: ReactNode;
	tooltip: ReactNode;
}

export function PopoverNote(props: PopoverNoteProps): ReactNode {
	const { children, isDisabled, label, tooltip } = props;

	return (
		<DialogTrigger>
			<TooltipTrigger>
				<Button
					className="inline-flex items-center gap-x-2 rounded-md border border-brand-200 bg-brand-50 p-2 text-sm font-medium text-brand-600 transition hover:bg-brand-100 focus-visible:focus-outline focus-visible:focus-outline-offset-0 disabled:cursor-not-allowed disabled:opacity-50 pressed:bg-brand-200"
					isDisabled={isDisabled}
				>
					{label}
				</Button>
				<Tooltip placement="bottom">{tooltip}</Tooltip>
			</TooltipTrigger>
			<Popover className="group max-w-72 min-w-[var(--trigger-width)] rounded-lg border border-brand-100 bg-white shadow-lg animate-in fade-in slide-in-from-top-2 placement-top:mb-2 placement-bottom:mt-2">
				<OverlayArrow>
					<svg
						className="block size-4 fill-white stroke-brand-100 stroke-1 group-placement-bottom:rotate-180"
						height={12}
						viewBox="0 0 12 12"
						width={12}
					>
						<path d="M0 0 L6 6 L12 0" />
					</svg>
				</OverlayArrow>
				<Dialog className="px-3 py-2 text-sm outline-none">
					<div>{children}</div>
				</Dialog>
			</Popover>
		</DialogTrigger>
	);
}
