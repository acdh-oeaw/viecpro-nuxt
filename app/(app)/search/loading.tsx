import type { ReactNode } from "react";

import { LoadingIndicator } from "@/components/loading-indicator";

export default function Loading(): ReactNode {
	return (
		<div className="grid place-content-center">
			<LoadingIndicator />
		</div>
	);
}
