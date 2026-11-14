import { assert } from "@acdh-oeaw/lib";
import { type ReactNode, createContext, use } from "react";

import type { ActionState } from "#/lib/server/actions.ts";

const ActionStateContext = createContext<ActionState | null>(null);

interface ActionStateProviderProps {
	children: ReactNode;
	state: ActionState;
}

export function ActionStateProvider(props: Readonly<ActionStateProviderProps>): ReactNode {
	const { children, state } = props;

	return <ActionStateContext value={state}>{children}</ActionStateContext>;
}

export function useActionStateContext(): ActionState {
	const value = use(ActionStateContext);

	assert(value != null);

	return value;
}
