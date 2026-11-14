"use client";

import dynamic from "next/dynamic";
import type { ComponentProps, ReactNode } from "react";
import { preconnect } from "react-dom";

const DynamicPointMap = dynamic(
	() => {
		return import("#/app/(app)/places/[id]/_components/point-map.tsx").then((module) => {
			return module.PointMap;
		});
	},
	{ ssr: false },
);

export function PointMap(props: ComponentProps<typeof DynamicPointMap>): ReactNode {
	/** Map tiles are the largest contentful paint element on place pages. */
	preconnect("https://tile.openstreetmap.org");

	return <DynamicPointMap {...props} />;
}
