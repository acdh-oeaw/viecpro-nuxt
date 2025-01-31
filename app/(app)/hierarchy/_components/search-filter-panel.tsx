"use client";

import { createUrlSearchParams, includes } from "@acdh-oeaw/lib";
import { type ReactNode, useOptimistic, useTransition } from "react";

import { DirectionSelect } from "@/app/(app)/hierarchy/_components/direction-select";
import { EntityComboBox } from "@/app/(app)/hierarchy/_components/entity-combobox";
import { GraphTypeSelect } from "@/app/(app)/hierarchy/_components/graph-type-select";
import type { AutocompleteItem } from "@/app/(app)/hierarchy/_lib/autocomplete";
import { graphs, type SearchFilters } from "@/app/(app)/hierarchy/_lib/hierarchy";
import { useRouter } from "@/lib/i18n/navigation";

interface SearchFilterPanelProps {
	directionOptions: Array<{ id: string; label: string }>;
	directionSelectLabel: string;
	entities: Map<number, AutocompleteItem>;
	entitiesComboBoxLabel: string;
	entitiesComboBoxTriggerLabel: string;
	graphOptions: Array<{ id: string; label: string }>;
	graphSelectLabel: string;
	graphSelectPlaceholder: string;
	isGraphSelectEnabled: boolean;
	legendLabels: Record<"function" | "institution" | "person", string>;
	searchFilters: SearchFilters;
}

export function SearchFilterPanel(props: SearchFilterPanelProps): ReactNode {
	const {
		directionOptions,
		directionSelectLabel,
		entities,
		entitiesComboBoxLabel,
		entitiesComboBoxTriggerLabel,
		graphOptions,
		graphSelectLabel,
		graphSelectPlaceholder,
		isGraphSelectEnabled,
		legendLabels,
		searchFilters,
	} = props;

	const router = useRouter();

	const [_isPending, startTransition] = useTransition();
	const [optimisticSearchFilters, updateOptimisticSearchFilters] = useOptimistic(
		searchFilters,
		(_state, searchFilters: SearchFilters) => {
			return searchFilters;
		},
	);

	return (
		<div
			className="flex flex-col flex-wrap gap-x-6 gap-y-4 sm:flex-row sm:items-baseline"
			role="search"
		>
			<EntityComboBox
				label={entitiesComboBoxLabel}
				legendLabels={legendLabels}
				name="id"
				onSelectionChange={(_id) => {
					const id = _id as number | null;

					if (id == null) {
						return;
					}

					const kind = entities.get(id)!.kind;
					const graph = includes(graphs[kind], optimisticSearchFilters.graph)
						? optimisticSearchFilters.graph
						: "default";
					const nextSearchFilters = { ...optimisticSearchFilters, id: id, kind, graph };

					startTransition(() => {
						updateOptimisticSearchFilters(nextSearchFilters);
						router.push(`?${createUrlSearchParams(nextSearchFilters)}`);
					});
				}}
				options={entities}
				selectedKey={optimisticSearchFilters.id}
				triggerLabel={entitiesComboBoxTriggerLabel}
			/>

			<GraphTypeSelect
				isDisabled={!isGraphSelectEnabled}
				label={graphSelectLabel}
				name="graph"
				onSelectionChange={(graph) => {
					const nextSearchFilters = { ...optimisticSearchFilters, graph };

					startTransition(() => {
						updateOptimisticSearchFilters(nextSearchFilters as SearchFilters);
						router.push(`?${createUrlSearchParams(nextSearchFilters)}`);
					});
				}}
				options={graphOptions}
				placeholder={graphSelectPlaceholder}
				selectedKey={optimisticSearchFilters.graph}
			/>

			<DirectionSelect
				label={directionSelectLabel}
				name="direction"
				onSelectionChange={(direction) => {
					const nextSearchFilters = { ...optimisticSearchFilters, direction };

					startTransition(() => {
						updateOptimisticSearchFilters(nextSearchFilters as SearchFilters);
						router.push(`?${createUrlSearchParams(nextSearchFilters)}`);
					});
				}}
				options={directionOptions}
				selectedKey={optimisticSearchFilters.direction}
			/>
		</div>
	);
}
