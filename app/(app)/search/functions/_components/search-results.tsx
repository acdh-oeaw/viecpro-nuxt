"use client";

import { createUrlSearchParams } from "@acdh-oeaw/lib";
import { ChevronLeftIcon, ChevronRightIcon, SortAscIcon, SortDescIcon } from "lucide-react";
import { type ReactNode, useOptimistic, useTransition } from "react";

import type {
	FunctionalIndexSearchResult,
	SearchFilters,
	SearchResults,
} from "@/app/(app)/search/functions/_lib/search";
import { Link } from "@/components/link";
import { createHref } from "@/lib/create-href";
import { useRouter } from "@/lib/i18n/navigation";

/** Maximum number of function terms listed per generic term, the rest is on the details page. */
const maxTerms = 12;

interface SearchResultsProps {
	countLabel: string;
	fieldOfActivityLabel: string;
	moreTermsLabel: string;
	nameLabel: string;
	nextPageLabel: string;
	previousPageLabel: string;
	searchFilters: SearchFilters;
	searchResults: SearchResults<FunctionalIndexSearchResult>;
	termsLabel: string;
}

export function SearchResults(props: SearchResultsProps): ReactNode {
	const {
		countLabel,
		fieldOfActivityLabel,
		moreTermsLabel,
		nameLabel,
		nextPageLabel,
		previousPageLabel,
		searchFilters,
		searchResults,
		termsLabel,
	} = props;

	const router = useRouter();

	const [isPending, startTransition] = useTransition();
	const [optimisticSearchFilters, updateOptimisticSearchFilters] = useOptimistic(
		searchFilters,
		(_state, searchFilters: SearchFilters) => {
			return searchFilters;
		},
	);

	const currentSortDirection = optimisticSearchFilters["sort-direction"];

	const matchedTermIds = new Set(searchResults.matchedTermIds);

	const hasPreviousPage = searchResults.page > 1;
	const hasNextPage = searchResults.page < searchResults.pages;

	function onSortChange(): void {
		const nextSearchFilters: SearchFilters = {
			...optimisticSearchFilters,
			sort: "name",
			"sort-direction": currentSortDirection === "desc" ? "asc" : "desc",
		};

		startTransition(() => {
			updateOptimisticSearchFilters(nextSearchFilters);
			router.push(`?${String(createUrlSearchParams(nextSearchFilters))}`);
		});
	}

	return (
		<div className="w-full">
			<div className="w-full overflow-x-auto outline-none xs:px-4 xs:pb-4">
				<table className="min-w-full text-sm text-brand-950" data-search-results={true}>
					<thead>
						<tr className="sticky top-0 z-10 border-b border-brand-100 bg-white text-left text-xs font-bold tracking-wider text-brand-600">
							<th className="w-64">
								<button
									className="inline-flex w-full items-center justify-between gap-x-4 px-4 py-3 transition hover:bg-brand-50 focus-visible:focus-outline focus-visible:-focus-outline-offset-2"
									onClick={onSortChange}
									type="button"
								>
									<span className="uppercase">{nameLabel}</span>
									{currentSortDirection === "desc" ? (
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
									)}
								</button>
							</th>
							<th className="w-64 px-4 py-3 uppercase">{fieldOfActivityLabel}</th>
							<th className="px-4 py-3 uppercase">{termsLabel}</th>
						</tr>
					</thead>

					<tbody>
						{searchResults.hits.map((hit) => {
							const searchResult = hit.document;
							const href = createHref({ pathname: `/functions/${searchResult.id}` });
							const terms = searchResult.terms.slice(0, maxTerms);
							const moreTerms = searchResult.terms.length - terms.length;

							return (
								<tr key={searchResult.id} className="align-top odd:bg-brand-50">
									<td className="px-4 py-2.5 font-medium">
										<Link className="underline-offset-2 hover:underline" href={href}>
											{searchResult.name}
										</Link>
									</td>
									<td className="px-4 py-2.5">{searchResult.fieldOfActivity}</td>
									<td className="px-4 py-2.5">
										<ul className="flex flex-wrap gap-x-3 gap-y-1" role="list">
											{terms.map((term) => {
												const isMatch = matchedTermIds.has(term.id);

												return (
													<li key={term.id}>
														<Link
															className="text-brand-600 underline-offset-2 hover:underline data-[match]:bg-brand-100 data-[match]:font-semibold"
															data-match={isMatch || undefined}
															href={createHref({
																pathname: "/search/persons",
																searchParams: { functions: term.name },
															})}
														>
															{term.name}
														</Link>
													</li>
												);
											})}
											{moreTerms > 0 ? (
												<li>
													<Link className="italic underline-offset-2 hover:underline" href={href}>
														{moreTerms} {moreTermsLabel}
													</Link>
												</li>
											) : null}
										</ul>
									</td>
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
