"use client";

import { cn } from "@acdh-oeaw/style-variants";
import type { ReactNode } from "react";

import { useSidePanel } from "@/app/(app)/search/_components/side-panel-provider";

interface SidePanelProps {
	children: ReactNode;
	className?: string;
}

export function SidePanel(props: SidePanelProps): ReactNode {
	const { children, className } = props;

	const { id, isOpen } = useSidePanel();

	return (
		<div>
			<aside className={cn("hidden h-full lg:block", className)}>{children}</aside>
			<aside
				className={cn(
					"absolute inset-y-0 z-10 h-full shadow-lg data-[state=collapsed]:hidden lg:hidden",
					className,
				)}
				data-state={isOpen ? "expanded" : "collapsed"}
				id={id}
			>
				{children}
			</aside>
		</div>
	);
}
