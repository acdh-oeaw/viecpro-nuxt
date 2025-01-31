import { useEffect, useState } from "react";

import type { ElementRef } from "@/app/(app)/hierarchy/_lib/use-element-ref";

interface UseResizeObserverParams {
	element: ElementRef<Element> | null;
	onChange?: (entry: ResizeObserverEntry) => void;
}

export function useResizeObserver(params: UseResizeObserverParams): ResizeObserverEntry | null {
	const { element } = params;

	const [entry, setEntry] = useState<ResizeObserverEntry | null>(null);

	useEffect(() => {
		if (element == null) return;

		const observer = new ResizeObserver(([entry]) => {
			if (entry == null) return;

			setEntry(entry);
		});

		observer.observe(element);

		return () => {
			observer.unobserve(element);
			observer.disconnect();
		};
	}, [element]);

	return entry;
}
