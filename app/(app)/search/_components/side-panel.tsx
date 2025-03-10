"use client";

import { cn } from "@acdh-oeaw/style-variants";
import { type ReactNode, useEffect } from "react";

import { useSidePanel } from "@/app/(app)/search/_components/side-panel-provider";

interface SidePanelProps {
	children: ReactNode;
	className?: string;
	isPending: boolean;
}

export function SidePanel(props: SidePanelProps): ReactNode {
	const { children, className, isPending } = props;

	const { id, isOpen, toggle } = useSidePanel();

	useEffect(() => {
		const controller = new AbortController();

		window.addEventListener(
			"keydown",
			(event) => {
				if (event.ctrlKey && event.key === "k") {
					event.preventDefault();
					toggle();
				}
			},
			{ signal: controller.signal },
		);

		return () => {
			controller.abort();
		};
	}, [toggle]);

	return (
		<div>
			<aside
				className={cn("hidden h-full lg:block", className)}
				data-pending={isPending || undefined}
			>
				{children}
			</aside>
			{}
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
		</div>
	);
}
