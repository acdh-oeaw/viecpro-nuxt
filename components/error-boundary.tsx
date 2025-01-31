"use client";

import { assert } from "@acdh-oeaw/lib";
import { Component, createContext, type ErrorInfo, type ReactNode, use } from "react";

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
			error: error instanceof Error ? error : new Error(`Error: ${String(error)}`),
		};
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		this.props.onError?.(error, errorInfo);
	}

	reset() {
		this.setState(initialState);
	}

	render() {
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
