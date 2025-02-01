"use client";

import { cn } from "@acdh-oeaw/style-variants";
import { PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "react-aria-components";

import { useSidePanel } from "@/app/(app)/search/_components/side-panel-provider";

interface SidePanelToggleProps {
	className?: string;
	label: string;
}

export function SidePanelToggle(props: SidePanelToggleProps): ReactNode {
	const { className, label } = props;

	const { id, isOpen, toggle } = useSidePanel();

	const Icon = isOpen ? PanelLeftCloseIcon : PanelLeftOpenIcon;

	return (
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
			<span className="sr-only">{label}</span>
		</Button>
	);
}
