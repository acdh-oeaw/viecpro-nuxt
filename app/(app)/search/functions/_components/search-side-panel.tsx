"use client";

import { createUrlSearchParams } from "@acdh-oeaw/lib";
import { Loader2Icon } from "lucide-react";
import { type ReactNode, useOptimistic, useTransition } from "react";

import { SearchFacets } from "#/app/(app)/search/_components/search-facets.tsx";
import { SearchTextField } from "#/app/(app)/search/_components/search-text-field.tsx";
import { SidePanelToggle } from "#/app/(app)/search/_components/side-panel-toggle.tsx";
import { SidePanel } from "#/app/(app)/search/_components/side-panel.tsx";
import type {
	FacetField,
	FunctionalIndexSearchResult,
	SearchFilters,
	SearchResults,
} from "#/app/(app)/search/functions/_lib/search.ts";
import { useRouter } from "#/lib/i18n/navigation.ts";

interface SearchSidePanelProps {
	closeLabel: string;
	fieldOfActivityFacetFilterLabel: string;
	fieldOfActivityFacetLabel: string;
	label: string;
	openLabel: string;
	searchFilters: SearchFilters;
	searchResults: SearchResults<FunctionalIndexSearchResult>;
	searchTextFieldLabel: string;
}

export function SearchSidePanel(props: SearchSidePanelProps): ReactNode {
	const {
		closeLabel,
		fieldOfActivityFacetFilterLabel,
		fieldOfActivityFacetLabel,
		label,
		openLabel,
		searchFilters,
		searchResults,
		searchTextFieldLabel,
	} = props;

	const router = useRouter();

	const [isPending, startTransition] = useTransition();
	const [optimisticSearchFilters, updateOptimisticSearchFilters] = useOptimistic(
		searchFilters,
		(_state, searchFilters: SearchFilters) => {
			return searchFilters;
		},
	);

	function navigate(nextSearchFilters: SearchFilters): void {
		startTransition(() => {
			updateOptimisticSearchFilters(nextSearchFilters);
			router.push(`?${String(createUrlSearchParams(nextSearchFilters))}`);
		});
	}

	function onFacetChange(name: FacetField, value: string, isSelected: boolean): void {
		const values = optimisticSearchFilters[name];
		const nextValues = isSelected
			? values.concat(value)
			: values.filter((v) => {
					return v !== value;
				});

		navigate({ ...optimisticSearchFilters, [name]: nextValues, page: 1 });
	}

	return (
		<SidePanel
			className="w-[min(100%,22rem)] border-r border-brand-100 bg-brand-50 animate-in fill-mode-both slide-in-from-left lg:w-88 lg:animate-none"
			isPending={isPending}
		>
			<header className="flex min-h-14 items-center justify-between gap-x-4 border-b border-brand-100 px-8 py-4 text-brand-600">
				<h2 className="inline-flex items-center gap-x-1.5 text-xs font-bold tracking-wider uppercase">
					{label}
					{isPending ? (
						<Loader2Icon aria-hidden={true} className="size-4 shrink-0 animate-spin" />
					) : null}
				</h2>
				<SidePanelToggle
					className="-mr-2 block lg:hidden"
					closeLabel={closeLabel}
					openLabel={openLabel}
				/>
			</header>

			<div className="grid gap-y-6 px-8 py-4" role="search">
				<SearchTextField
					label={searchTextFieldLabel}
					name="q"
					onChange={(value) => {
						navigate({ ...optimisticSearchFilters, q: value, page: 1 });
					}}
					value={optimisticSearchFilters.q}
				/>
				<SearchFacets
					filterLabel={fieldOfActivityFacetFilterLabel}
					kind="function"
					label={fieldOfActivityFacetLabel}
					name="fieldOfActivity"
					onFacetChange={onFacetChange}
					options={searchResults.facets.get("fieldOfActivity")?.values ?? []}
					searchFilters={optimisticSearchFilters}
					selectedKeys={new Set(optimisticSearchFilters.fieldOfActivity)}
				/>
			</div>
		</SidePanel>
	);
}
