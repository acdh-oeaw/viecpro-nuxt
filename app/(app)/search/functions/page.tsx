import { ChevronRightIcon, InfoIcon } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";
import { getFormatter, getTranslations } from "next-intl/server";
import { type ReactNode, Suspense } from "react";

import { SearchResults } from "@/app/(app)/search/functions/_components/search-results";
import { SearchSidePanel } from "@/app/(app)/search/functions/_components/search-side-panel";
import {
	getSearchFilters,
	getSearchResults,
	getTermStatistics,
} from "@/app/(app)/search/functions/_lib/search";
import { SidePanelToggle } from "@/app/(app)/search/_components/side-panel-toggle";
import { LoadingIndicator } from "@/components/loading-indicator";
import { MainContent } from "@/components/main-content";

interface SearchFunctionsPageProps {
	searchParams: Promise<SearchParams>;
}

export async function generateMetadata(
	_props: Readonly<SearchFunctionsPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const t = await getTranslations("SearchFunctionsPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function SearchFunctionsPage(
	props: Readonly<SearchFunctionsPageProps>,
): Promise<ReactNode> {
	const { searchParams } = props;

	const t = await getTranslations("SearchFunctionsPage");
	const format = await getFormatter();

	const searchFilters = getSearchFilters(await searchParams);
	const [searchResults, termStatistics] = await Promise.all([
		getSearchResults(searchFilters),
		getTermStatistics(),
	]);

	const unassignedTerms = termStatistics.total - termStatistics.assigned;

	return (
		<div className="relative grid grid-cols-[auto_1fr]">
			<SearchSidePanel
				closeLabel={t("close-search-filter-panel")}
				fieldOfActivityFacetFilterLabel={t("facets.filter.field-of-activity")}
				fieldOfActivityFacetLabel={t("facets.field-of-activity")}
				label={t("search-filters")}
				openLabel={t("open-search-filter-panel")}
				searchFilters={searchFilters}
				searchResults={searchResults}
				searchTextFieldLabel={t("search")}
			/>

			<MainContent className="min-w-0">
				<header>
					<h1 className="sr-only">{t("title")}</h1>

					<div className="flex min-h-14 items-center gap-x-6 border-b border-brand-100 px-2.5 py-2 text-brand-600 xs:px-6">
						<div className="inline-flex items-center gap-x-4 text-xs font-medium sm:text-sm">
							<SidePanelToggle
								className="block lg:hidden"
								closeLabel={t("close-search-filter-panel")}
								openLabel={t("open-search-filter-panel")}
							/>

							<div className="flex items-center gap-x-1.5 text-brand-600">
								<span>{t("search")}</span>
								<ChevronRightIcon aria-hidden={true} className="size-3 shrink-0 sm:size-4" />
								<span>{t("functions")}</span>
							</div>
						</div>

						<span className="ml-auto inline-flex items-center gap-x-4 text-xs font-medium">
							<span className="hidden text-right xs:block">
								{t("search-results-count", { count: searchResults.count })}
							</span>
						</span>
					</div>

					{unassignedTerms > 0 ? (
						<p className="flex items-start gap-x-2 border-b border-brand-100 px-2.5 py-3 text-sm text-neutral-600 xs:px-6">
							<InfoIcon aria-hidden={true} className="mt-0.5 size-4 shrink-0 text-brand-500" />
							<span>
								{t("unassigned-terms", {
									assigned: format.number(termStatistics.assigned),
									total: format.number(termStatistics.total),
									unassigned: format.number(unassignedTerms),
								})}
							</span>
						</p>
					) : null}
				</header>

				<Suspense fallback={<LoadingIndicator />}>
					<SearchResults
						countLabel={t("search-results.count", {
							count: searchResults.count,
							page: format.number(searchResults.page),
							pages: format.number(searchResults.pages),
						})}
						fieldOfActivityLabel={t("field-of-activity")}
						moreTermsLabel={t("more-terms")}
						nameLabel={t("name")}
						nextPageLabel={t("search-results.next-page")}
						previousPageLabel={t("search-results.previous-page")}
						searchFilters={searchFilters}
						searchResults={searchResults}
						termsLabel={t("terms")}
					/>
				</Suspense>
			</MainContent>
		</div>
	);
}
