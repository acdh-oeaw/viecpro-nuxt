import type { ReactNode } from "react";

interface AppLayoutProps {
	children: ReactNode;
}

export function AppLayout(props: Readonly<AppLayoutProps>): ReactNode {
	const { children } = props;

	return (
		<div className="relative isolate grid min-h-full grid-rows-[auto_minmax(calc(100dvh-76px),1fr)_auto]">
			{children}
		</div>
	);
}
