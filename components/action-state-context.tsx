import { assert } from "@acdh-oeaw/lib";
import { createContext, type ReactNode, use } from "react";

import type { ActionState } from "@/lib/server/actions";

const ActionStateContext = createContext<ActionState | null>(null);

interface ActionStateProviderProps {
	children: ReactNode;
	state: ActionState;
}

export function ActionStateProvider(props: Readonly<ActionStateProviderProps>): ReactNode {
	const { children, state } = props;

	return <ActionStateContext.Provider value={state}>{children}</ActionStateContext.Provider>;
}

export function useActionStateContext(): ActionState {
	const value = use(ActionStateContext);

	assert(value != null);

	return value;
}
