"use client";

import dynamic from "next/dynamic";

export const PointMap = dynamic(
	() => {
		return import("@/app/(app)/places/[id]/_components/point-map").then((module) => {
			return module.PointMap;
		});
	},
	{ ssr: false },
);
