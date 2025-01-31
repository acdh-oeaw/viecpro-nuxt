import { cn } from "@acdh-oeaw/style-variants";
import type { ReactNode } from "react";

const colors = {
	grün: "bg-green-600",
	rot: "bg-red-600",
	gelb: "bg-yellow-600",
};

interface StatusIndicatorProps {
	status: "gelb" | "grün" | "rot";
}

export function StatusIndicator(props: StatusIndicatorProps): ReactNode {
	const { status } = props;

	return <div className={cn("mx-auto size-2 rounded-full", colors[status])} />;
}
