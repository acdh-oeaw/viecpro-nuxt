"use client";

import { assert } from "@acdh-oeaw/lib";
import { Component, type ErrorInfo, type ReactNode, createContext, use } from "react";

interface ErrorBoundaryContextValue {
	error: Error;
	reset: () => void;
}

const ErrorBoundaryContext = createContext<ErrorBoundaryContextValue | null>(null);

export function useErrorBoundary() {
	const value = use(ErrorBoundaryContext);

	assert(value != null, "`useErrorBoundary` must be used within an `ErrorBoundary` component.");

	return value;
}

interface ErrorBoundaryProps {
	children: ReactNode;
	fallback: ReactNode;
	onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

type ErrorBoundaryState =
	| {
			status: "default";
			error: null;
	  }
	| {
			status: "error";
			error: Error;
	  };

const initialState: ErrorBoundaryState = {
	status: "default",
	error: null,
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);

		this.state = initialState;

		this.reset = this.reset.bind(this);
	}

	static getDerivedStateFromError(error: unknown) {
		return {
			status: "error",
			// eslint-disable-next-line unicorn/no-instanceof-builtins -- `Error.isError` is not in the targeted `lib` yet.
			error: error instanceof Error ? error : new Error(`Error: ${String(error)}`),
		};
	}

	override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		this.props.onError?.(error, errorInfo);
	}

	reset() {
		this.setState(initialState);
	}

	override render() {
		if (this.state.status === "error") {
			return (
				// eslint-disable-next-line @typescript-eslint/unbound-method
				<ErrorBoundaryContext.Provider value={{ error: this.state.error, reset: this.reset }}>
					{this.props.fallback}
				</ErrorBoundaryContext.Provider>
			);
		}

		return this.props.children;
	}
}
