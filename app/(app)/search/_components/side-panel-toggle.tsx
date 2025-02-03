"use client";

import { cn } from "@acdh-oeaw/style-variants";
import { PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "react-aria-components";

import { useSidePanel } from "@/app/(app)/search/_components/side-panel-provider";
import { Tooltip, TooltipTrigger } from "@/components/tooltip";

interface SidePanelToggleProps {
	className?: string;
	closeLabel: string;
	openLabel: string;
}

export function SidePanelToggle(props: SidePanelToggleProps): ReactNode {
	const { className, closeLabel, openLabel } = props;

	const { id, isOpen, toggle } = useSidePanel();

	const Icon = isOpen ? PanelLeftCloseIcon : PanelLeftOpenIcon;

	return (
		<TooltipTrigger>
			<Button
				aria-controls={id}
				aria-expanded={isOpen}
				className={cn(
					"rounded-md border border-brand-200 bg-brand-50 p-2 text-sm font-medium text-brand-500 transition hover:bg-brand-100 pressed:bg-brand-200",
					className,
				)}
				onPress={toggle}
			>
				<Icon aria-hidden={true} className="size-5" />
				<span className="sr-only">
					{/* eslint-disable-next-line react/jsx-no-literals */}
					{isOpen ? closeLabel : openLabel} <kbd>⌘+K</kbd>
				</span>
			</Button>
			<Tooltip placement="right">
				<span className="inline-flex gap-x-2 items-center">
					{isOpen ? closeLabel : openLabel} {/* eslint-disable-next-line react/jsx-no-literals */}
					<kbd className="font-body font-medium text-xs rounded-sm border border-white px-1 leading-4 opacity-75">
						⌘+K
					</kbd>
				</span>
			</Tooltip>
		</TooltipTrigger>
	);
}
