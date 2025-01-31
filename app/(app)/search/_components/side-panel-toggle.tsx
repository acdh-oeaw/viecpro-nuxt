"use client";

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
		<Button aria-controls={id} aria-expanded={isOpen} className={className} onPress={toggle}>
			<Icon aria-hidden={true} className="size-5" />
			<span className="sr-only">{label}</span>
		</Button>
	);
}
