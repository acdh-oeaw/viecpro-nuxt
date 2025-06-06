"use client";

import { createUrlSearchParams } from "@acdh-oeaw/lib";
import { Loader2Icon } from "lucide-react";
import { type ReactNode, useOptimistic, useTransition } from "react";

import { SearchDateRangeSlider } from "@/app/(app)/search/_components/search-date-range-slider";
import { SearchEmptyDateCheckbox } from "@/app/(app)/search/_components/search-empty-date-checkbox";
import { SearchFacets } from "@/app/(app)/search/_components/search-facets";
import { SearchTextField } from "@/app/(app)/search/_components/search-text-field";
import { SidePanel } from "@/app/(app)/search/_components/side-panel";
import { SidePanelToggle } from "@/app/(app)/search/_components/side-panel-toggle";
import type {
	Court,
	FacetField,
	SearchFilters,
	SearchResults,
} from "@/app/(app)/search/courts/_lib/search";
import { maxDate, minDate } from "@/config/search.config";
import { useRouter } from "@/lib/i18n/navigation";

interface SearchSidePanelProps {
	categoryFacetFilterLabel: string;
	categoryFacetLabel: string;
	dateRangeLabel: string;
	emptyDateCheckBoxLabel: string;
	closeLabel: string;
	label: string;
	openLabel: string;
	searchFilters: SearchFilters;
	searchResults: SearchResults<Court>;
	searchTextFieldLabel: string;
	statusFacetFilterLabel: string;
	statusFacetLabel: string;
	thumbLabels: [string, string];
}

export function SearchSidePanel(props: SearchSidePanelProps): ReactNode {
	const {
		categoryFacetFilterLabel,
		categoryFacetLabel,
		closeLabel,
		dateRangeLabel,
		emptyDateCheckBoxLabel,
		label,
		openLabel,
		searchFilters,
		searchResults,
		searchTextFieldLabel,
		statusFacetFilterLabel,
		statusFacetLabel,
		thumbLabels,
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
			className="w-[min(100%,22rem)] border-r border-brand-100 bg-brand-50 animate-in fill-mode-both slide-in-from-left lg:w-[22rem] lg:animate-none"
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
						const nextSearchFilters = { ...optimisticSearchFilters, q: value, page: 1 };

						startTransition(() => {
							updateOptimisticSearchFilters(nextSearchFilters);
							router.push(`?${String(createUrlSearchParams(nextSearchFilters))}`);
						});
					}}
					value={optimisticSearchFilters.q}
				/>
				<div className="grid gap-y-2">
					<SearchDateRangeSlider
						/** Remount component when value changes, e.g. when pressing browser back button, because we are using the slider as uncontrolled component. */
						key={[searchFilters["start-date"], searchFilters["end-date"]].join("-")}
						defaultValue={[
							optimisticSearchFilters["start-date"],
							optimisticSearchFilters["end-date"],
						]}
						label={dateRangeLabel}
						maxValue={maxDate}
						minValue={minDate}
						names={["start-date", "end-date"]}
						onChange={([start, end]) => {
							const nextSearchFilters = {
								...optimisticSearchFilters,
								"start-date": start,
								"end-date": end,
								page: 1,
							};

							startTransition(() => {
								updateOptimisticSearchFilters(nextSearchFilters);
								router.push(`?${String(createUrlSearchParams(nextSearchFilters))}`);
							});
						}}
						thumbLabels={thumbLabels}
					/>
					<SearchEmptyDateCheckbox
						checked={optimisticSearchFilters["empty-date"] === "include"}
						label={emptyDateCheckBoxLabel}
						name="empty-date"
						onChange={(isSelected) => {
							const nextSearchFilters = {
								...optimisticSearchFilters,
								"empty-date": isSelected ? "include" : "omit",
								page: 1,
							};

							startTransition(() => {
								updateOptimisticSearchFilters(nextSearchFilters as SearchFilters);
								router.push(`?${String(createUrlSearchParams(nextSearchFilters))}`);
							});
						}}
					/>
				</div>
				<SearchFacets
					filterLabel={categoryFacetFilterLabel}
					kind="court"
					label={categoryFacetLabel}
					name="category"
					onFacetChange={onFacetChange}
					options={searchResults.facets.get("category")!.values}
					searchFilters={optimisticSearchFilters}
					selectedKeys={new Set(optimisticSearchFilters.category)}
				/>
				<SearchFacets
					filterLabel={statusFacetFilterLabel}
					kind="court"
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
