"use client";

import type { ReactNode } from "react";
import {
	OverlayArrow,
	Tooltip as AriaTooltip,
	type TooltipProps as AriaTooltipProps,
} from "react-aria-components";

export { TooltipTrigger } from "react-aria-components";

interface TooltipProps {
	children: ReactNode;
	placement?: AriaTooltipProps["placement"];
}

export function Tooltip(props: TooltipProps): ReactNode {
	const { children, placement } = props;

	return (
		<AriaTooltip
			className="group rounded-md bg-brand-800 px-3 py-1 text-sm font-medium text-white"
			offset={4}
			placement={placement}
		>
			<OverlayArrow>
				<svg
					className="block size-3 fill-brand-800 stroke-brand-100 stroke-1 group-placement-left:-rotate-90 group-placement-right:rotate-90 group-placement-bottom:rotate-180"
					height={8}
					viewBox="0 0 8 8"
					width={8}
				>
					<path d="M0 0 L4 4 L8 0" />
				</svg>
			</OverlayArrow>
			{children}
		</AriaTooltip>
	);
}
