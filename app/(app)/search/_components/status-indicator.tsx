import { cn } from "@acdh-oeaw/style-variants";
import type { ReactNode } from "react";

const colors = {
	grün: "bg-status-green",
	rot: "bg-status-red",
	gelb: "bg-status-yellow",
};

interface StatusIndicatorProps {
	status: "gelb" | "grün" | "rot";
}

export function StatusIndicator(props: StatusIndicatorProps): ReactNode {
	const { status } = props;

	return <div className={cn("mx-auto size-2 rounded-full", colors[status])} />;
}
