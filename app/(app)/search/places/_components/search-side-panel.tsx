"use client";

import { createUrlSearchParams } from "@acdh-oeaw/lib";
import { Loader2Icon } from "lucide-react";
import { type ReactNode, useOptimistic, useTransition } from "react";

import { SearchFacets } from "@/app/(app)/search/_components/search-facets";
import { SearchTextField } from "@/app/(app)/search/_components/search-text-field";
import { SidePanel } from "@/app/(app)/search/_components/side-panel";
import { SidePanelToggle } from "@/app/(app)/search/_components/side-panel-toggle";
import type {
	FacetField,
	Place,
	SearchFilters,
	SearchResults,
} from "@/app/(app)/search/places/_lib/search";
import { useRouter } from "@/lib/i18n/navigation";

interface SearchSidePanelProps {
	categoryFacetFilterLabel: string;
	categoryFacetLabel: string;
	label: string;
	searchFilters: SearchFilters;
	searchResults: SearchResults<Place>;
	searchTextFieldLabel: string;
	statusFacetFilterLabel: string;
	statusFacetLabel: string;
	toggleLabel: string;
}

export function SearchSidePanel(props: SearchSidePanelProps): ReactNode {
	const {
		categoryFacetLabel,
		categoryFacetFilterLabel,
		label,
		searchFilters,
		searchResults,
		searchTextFieldLabel,
		statusFacetFilterLabel,
		statusFacetLabel,
		toggleLabel,
	} = props;

	const router = useRouter();

	const [isPending, startTransition] = useTransition();
	const [optimisticSearchFilters, updateOptimisticSearchFilters] = useOptimistic(
		searchFilters,
		(_state, searchFilters: SearchFilters) => {
			return searchFilters;
		},
	);

	function onFacetChange(name: string, value: string, isSelected: boolean): void {
		const values = optimisticSearchFilters[name as FacetField];
		const nextValues = isSelected
			? values.concat(value)
			: values.filter((v) => {
					return v !== value;
				});

		const nextSearchFilters = { ...optimisticSearchFilters, [name]: nextValues, page: 1 };

		startTransition(() => {
			updateOptimisticSearchFilters(nextSearchFilters);
			router.push(`?${String(createUrlSearchParams(nextSearchFilters))}`);
		});
	}

	return (
		<SidePanel
			className="w-[min(100%,22rem)] lg:w-[22rem] border-r border-brand-100 bg-brand-50 animate-in slide-in-from-left fill-mode-both lg:animate-none"
			isPending={isPending}
		>
			<header className="flex min-h-14 items-center justify-between gap-x-4 border-b border-brand-100 px-8 py-4 text-brand-600">
				<h2 className="inline-flex items-center gap-x-1.5 text-xs font-bold uppercase tracking-wider">
					{label}
					{isPending ? (
						<Loader2Icon aria-hidden={true} className="size-4 shrink-0 animate-spin" />
					) : null}
				</h2>
				<SidePanelToggle className="-mr-2 block lg:hidden" label={toggleLabel} />
			</header>

			<div className="grid gap-y-6 px-8 py-4" role="search">
				<SearchTextField
					label={searchTextFieldLabel}
					name="q"
					onChange={(value) => {
						const nextSearchFilters = { ...optimisticSearchFilters, q: value, page: 1 };

						startTransition(() => {
							updateOptimisticSearchFilters(nextSearchFilters);
							router.push(`?${String(createUrlSearchParams(nextSearchFilters))}`);
						});
					}}
					value={optimisticSearchFilters.q}
				/>
				<SearchFacets
					filterLabel={categoryFacetFilterLabel}
					kind="place"
					label={categoryFacetLabel}
					name="category"
					onFacetChange={onFacetChange}
					options={searchResults.facets.get("category")!.values}
					searchFilters={optimisticSearchFilters}
					selectedKeys={new Set(optimisticSearchFilters.category)}
				/>
				<SearchFacets
					filterLabel={statusFacetFilterLabel}
					kind="place"
					label={statusFacetLabel}
					name="status"
					onFacetChange={onFacetChange}
					options={searchResults.facets.get("status")!.values}
					searchFilters={optimisticSearchFilters}
					selectedKeys={new Set(optimisticSearchFilters.status)}
				/>
			</div>
		</SidePanel>
	);
}
