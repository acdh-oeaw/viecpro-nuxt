"use client";

import { createUrlSearchParams } from "@acdh-oeaw/lib";
import * as d3 from "d3";
import { type MouseEvent, type ReactNode, use, useMemo } from "react";

import { groups } from "@/app/(app)/hierarchy/_lib/autocomplete";
import type { GraphNode } from "@/app/(app)/hierarchy/_lib/hierarchy";
import { useElementRef } from "@/app/(app)/hierarchy/_lib/use-element-ref";
import { useVisualisationDimensions } from "@/app/(app)/hierarchy/_lib/use-visualisation-dimensions";
import { colors } from "@/config/visualisation.config";
import { useRouter } from "@/lib/i18n/navigation";

interface HierarchyVisualisationProps {
	data: Promise<GraphNode>;
}

export function HierarchyVisualisation(props: HierarchyVisualisationProps): ReactNode {
	const { data: dataPromise } = props;

	const data = use(dataPromise);

	const router = useRouter();

	const tree = useMemo(() => {
		const root = d3.hierarchy(data);

		root.sort((a, z) => {
			return z.height - a.height || a.data.meta.label.localeCompare(z.data.meta.label);
		});

		const layout = d3.tree<GraphNode>();
		layout(root);

		root.count();

		return root;
	}, [data]);

	const [containerRef, setContainerRef] = useElementRef();

	const dimensions = useVisualisationDimensions({
		dimensions: {
			marginBottom: 35,
			marginLeft: 150,
			marginRight: 325,
			marginTop: 15,
			/** Ensure every leaf node has at least 16px height available. */
			minHeight: tree.value! * 16 + 35 + 15,
			/** Ensure every hierarchy level has at least 150px width available to avoid labels bleeding into the next level. */
			minWidth: tree.height * 150 + 325 + 150,
		},
		element: containerRef,
	});

	const line = d3
		.linkHorizontal<d3.HierarchyPointLink<GraphNode>, d3.HierarchyPointNode<GraphNode>>()
		.x((d) => {
			return d.y * dimensions.boundedWidth;
		})
		.y((d) => {
			return d.x * dimensions.boundedHeight;
		});

	function getNodeColor(node: d3.HierarchyNode<GraphNode>) {
		switch (node.data.meta.entity_type) {
			case "Funktion": {
				return colors.function;
			}

			case "Institution": {
				return colors.institution;
			}

			case "Person": {
				return colors.person;
			}

			default: {
				return colors.default;
			}
		}
	}

	function onNodeClick(event: MouseEvent<HTMLAnchorElement>) {
		event.preventDefault();
		const href = event.currentTarget.getAttribute("href");
		if (href) {
			router.push(href);
		}
	}

	return (
		<div
			ref={setContainerRef}
			className="relative isolate size-full min-h-[640px] overflow-auto"
			data-visualisation-container={true}
		>
			<svg
				className="absolute inset-0 overflow-hidden"
				height={dimensions.height}
				width={dimensions.width}
			>
				<g
					className="text-sm"
					transform={`translate(${String(dimensions.marginLeft)}, ${String(dimensions.marginTop)})`}
				>
					<g fill="none" stroke={colors.edge} strokeOpacity={0.25} strokeWidth={1.5}>
						{(tree.links() as Array<d3.HierarchyPointLink<GraphNode>>).map((link, index) => {
							return (
								<path
									key={[link.source.data.meta.pk, link.target.data.meta.pk, index].join("+")}
									d={line(link) ?? undefined}
								/>
							);
						})}
					</g>
					<g strokeLinejoin="round" strokeWidth={3}>
						{(tree.descendants() as Array<d3.HierarchyPointNode<GraphNode>>).map((node, index) => {
							return (
								<a
									key={[node.data.meta.pk, index].join("+")}
									href={`/hierarchy?${String(
										createUrlSearchParams({
											kind: groups[node.data.meta.entity_type],
											id: node.data.meta.pk,
										}),
									)}`}
									onClick={onNodeClick}
									// @ts-expect-error `transform` is valid on SVGAElement (but not HTMLAnchorElement)
									transform={`translate(${String(node.y * dimensions.boundedWidth)},${String(node.x * dimensions.boundedHeight)})`}
								>
									<circle fill={getNodeColor(node)} r={3} />
									<title>{node.data.meta.label}</title>
									<text
										cursor="default"
										dominantBaseline="middle"
										fill={colors.text}
										paintOrder="stroke"
										textAnchor={node.children ? "end" : "start"}
										x={node.children ? -6 : 6}
									>
										{node.data.meta.label}
									</text>
								</a>
							);
						})}
					</g>
				</g>
			</svg>
		</div>
	);
}
