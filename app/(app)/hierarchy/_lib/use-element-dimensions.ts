import type { ElementRef } from "@/app/(app)/hierarchy/_lib/use-element-ref";
import { useResizeObserver } from "@/app/(app)/hierarchy/_lib/use-resize-observer";

interface UseElementDimensionsParams {
	element: ElementRef<Element> | null;
}

export function useElementDimensions(params: UseElementDimensionsParams): DOMRectReadOnly | null {
	const { element } = params;

	const rect = useResizeObserver({ element });

	return rect?.contentRect ?? element?.getBoundingClientRect() ?? null;
}
