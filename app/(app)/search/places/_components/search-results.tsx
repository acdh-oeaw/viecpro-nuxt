"use client";

import { createUrlSearchParams } from "@acdh-oeaw/lib";
import { ChevronLeftIcon, ChevronRightIcon, SortAscIcon, SortDescIcon } from "lucide-react";
import { type ReactNode, useOptimistic, useTransition } from "react";

import { StatusIndicator } from "@/app/(app)/search/_components/status-indicator";
import type {
	Place,
	SearchFilters,
	SearchResults,
	SortField,
} from "@/app/(app)/search/places/_lib/search";
import { Link } from "@/components/link";
import { createHref } from "@/lib/create-href";
import { useRouter } from "@/lib/i18n/navigation";

const columns = [
	{ field: "name", label: "Bezeichnung", sort: "name" },
	// { field: "startDateWritten", label: "Beginn", sort: "startDate" },
	// { field: "endDateWritten", label: "Ende", sort: "endDate" },
	{ field: "category", label: "Kategorie", sort: "category" },
	{ field: "status", label: "Status", sort: "status" },
] as const satisfies Array<{ field: keyof Place; label: string; sort: SortField }>;

const linkField = "name";

interface SearchResultsProps {
	countLabel: string;
	nextPageLabel: string;
	previousPageLabel: string;
	searchFilters: SearchFilters;
	searchResults: SearchResults<Place>;
}

export function SearchResults(props: SearchResultsProps): ReactNode {
	const { countLabel, nextPageLabel, previousPageLabel, searchFilters, searchResults } = props;

	const router = useRouter();

	const [isPending, startTransition] = useTransition();
	const [optimisticSearchFilters, updateOptimisticSearchFilters] = useOptimistic(
		searchFilters,
		(_state, searchFilters: SearchFilters) => {
			return searchFilters;
		},
	);

	const currentSortField = optimisticSearchFilters.sort;
	const currentSortDirection = optimisticSearchFilters["sort-direction"];

	const hasPreviousPage = searchResults.page > 1;
	const hasNextPage = searchResults.page < searchResults.pages;

	return (
		<div className="w-full">
			<div className="w-full overflow-x-auto outline-none xs:px-4 xs:pb-4">
				<table className="min-w-full text-sm text-brand-950" data-search-results={true}>
					<thead>
						<tr className="sticky top-0 border-b border-brand-100 bg-white text-left text-xs font-bold tracking-wider text-brand-600">
							{columns.map((column) => {
								function onSortChange(): void {
									if (column.sort === currentSortField) {
										const nextSearchFilters = {
											...optimisticSearchFilters,
											sort: column.sort,
											"sort-direction": currentSortDirection === "desc" ? "asc" : "desc",
										};

										startTransition(() => {
											updateOptimisticSearchFilters(nextSearchFilters as SearchFilters);
											router.push(`?${createUrlSearchParams(nextSearchFilters)}`);
										});
									} else {
										startTransition(() => {
											const nextSearchFilters = {
												...optimisticSearchFilters,
												sort: column.sort,
												"sort-direction": "asc",
											};

											updateOptimisticSearchFilters(nextSearchFilters as SearchFilters);
											router.push(`?${createUrlSearchParams(nextSearchFilters)}`);
										});
									}
								}

								return (
									<th key={column.field} className={column.field === "status" ? "w-20" : undefined}>
										<button
											className="inline-flex w-full items-center justify-between gap-x-4 px-4 py-3 transition hover:bg-brand-50 focus-visible:focus-outline focus-visible:-focus-outline-offset-2"
											onClick={onSortChange}
											type="button"
										>
											<span className="uppercase">{column.label}</span>
											{column.sort === currentSortField ? (
												currentSortDirection === "desc" ? (
													<SortDescIcon
														aria-hidden={true}
														className="size-4 shrink-0 text-brand-400 pending:animate-pulse"
														data-pending={isPending || undefined}
													/>
												) : (
													<SortAscIcon
														aria-hidden={true}
														className="size-4 shrink-0 text-brand-400 pending:animate-pulse"
														data-pending={isPending || undefined}
													/>
												)
											) : null}
										</button>
									</th>
								);
							})}
						</tr>
					</thead>

					<tbody>
						{searchResults.hits.map((hit) => {
							const searchResult = hit.document;

							return (
								<tr key={searchResult.id} className="relative odd:bg-brand-50">
									{columns.map((column) => {
										return (
											<td key={column.field} className="px-4 py-2.5 whitespace-nowrap">
												{column.field === "status" ? (
													<StatusIndicator status={searchResult[column.field]} />
												) : column.field === linkField ? (
													<Link
														className="after:absolute after:inset-0 after:transition hover:after:bg-brand-500/15 focus-visible:after:focus-outline focus-visible:after:-focus-outline-offset-2"
														href={createHref({ pathname: `/places/${searchResult.id}` })}
													>
														{searchResult[column.field]}
													</Link>
												) : (
													searchResult[column.field]
												)}
											</td>
										);
									})}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			<footer className="flex flex-col items-center justify-center gap-x-6 gap-y-4 border-t border-brand-100 px-2.5 py-4 text-sm text-brand-600 xs:px-6 sm:flex-row sm:justify-between">
				<span>{countLabel}</span>
				{hasPreviousPage || hasNextPage ? (
					<span className="inline-flex items-center gap-x-6 sm:ml-auto">
						<Link
							className="inline-flex items-center gap-x-1.5 hover:underline focus-visible:focus-outline disabled:opacity-50"
							href={createHref({
								searchParams: { ...optimisticSearchFilters, page: searchResults.page - 1 },
							})}
							isDisabled={!hasPreviousPage}
						>
							<ChevronLeftIcon aria-hidden={true} className="size-4 shrink-0 text-brand-400" />
							{previousPageLabel}
						</Link>
						<Link
							className="inline-flex items-center gap-x-1.5 text-right hover:underline focus-visible:focus-outline disabled:opacity-50"
							href={createHref({
								searchParams: { ...optimisticSearchFilters, page: searchResults.page + 1 },
							})}
							isDisabled={!hasNextPage}
						>
							{nextPageLabel}
							<ChevronRightIcon aria-hidden={true} className="size-4 shrink-0 text-brand-400" />
						</Link>
					</span>
				) : null}
			</footer>
		</div>
	);
}
