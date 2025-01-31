import { useState } from "react";

const brand = Symbol("element-ref");

/** Callback ref created with `useElementRef`. */
export type ElementRef<T extends Element> = T & { [brand]: true };

export function useElementRef<T extends Element>(): [
	ElementRef<T> | null,
	(element: T | null) => void,
] {
	const [element, setElement] = useState<T | null>(null);

	return [element as ElementRef<T> | null, setElement];
}
