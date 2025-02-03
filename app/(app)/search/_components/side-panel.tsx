"use client";

import { cn } from "@acdh-oeaw/style-variants";
import { Fragment, type ReactNode } from "react";

import { useSidePanel } from "@/app/(app)/search/_components/side-panel-provider";

interface SidePanelProps {
	children: ReactNode;
	className?: string;
	isPending: boolean;
}

export function SidePanel(props: SidePanelProps): ReactNode {
	const { children, className, isPending } = props;

	const { id, isOpen } = useSidePanel();

	// TODO: add data-entering and data-exiting

	return (
		<Fragment>
			<aside
				className={cn("hidden h-full lg:block", className)}
				data-pending={isPending || undefined}
			>
				{children}
			</aside>
			<aside
				className={cn(
					"absolute inset-y-0 z-10 h-full shadow-lg data-[state=collapsed]:hidden lg:hidden",
					className,
				)}
				data-pending={isPending || undefined}
				data-state={isOpen ? "expanded" : "collapsed"}
				id={id}
			>
				{children}
			</aside>
		</Fragment>
	);
}
