"use client";

import { assert } from "@acdh-oeaw/lib";
import { createContext, type ReactNode, use, useId, useState } from "react";

interface SidePanelContextValue {
	id: string;
	isOpen: boolean;
	toggle: () => void;
}

const SidePanelContext = createContext<SidePanelContextValue | null>(null);

export function useSidePanel(): SidePanelContextValue {
	const value = use(SidePanelContext);

	assert(value != null, "`useSidePanel` must be used within a `SidePanelProvider` component.");

	return value;
}

interface SidePanelProviderProps {
	children: ReactNode;
}

export function SidePanelProvider(props: SidePanelProviderProps): ReactNode {
	const { children } = props;

	const [isOpen, setIsOpen] = useState(false);
	const id = useId();

	function toggle() {
		setIsOpen((isOpen) => {
			return !isOpen;
		});
	}

	return (
		<SidePanelContext.Provider value={{ id, isOpen, toggle }}>{children}</SidePanelContext.Provider>
	);
}
