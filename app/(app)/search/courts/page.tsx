import { ChevronRightIcon } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";
import { getFormatter, getTranslations } from "next-intl/server";
import { type ReactNode, Suspense } from "react";

import { SidePanelToggle } from "@/app/(app)/search/_components/side-panel-toggle";
import { SearchResults } from "@/app/(app)/search/courts/_components/search-results";
import { SearchSidePanel } from "@/app/(app)/search/courts/_components/search-side-panel";
import { getSearchFilters, getSearchResults } from "@/app/(app)/search/courts/_lib/search";
import { DownloadDialog } from "@/components/download-dialog";
import { LoadingIndicator } from "@/components/loading-indicator";
import { MainContent } from "@/components/main-content";
import { isodate } from "@/lib/isodate";

interface SearchCourtsPageProps {
	searchParams: Promise<SearchParams>;
}

export async function generateMetadata(
	_props: Readonly<SearchCourtsPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const t = await getTranslations("SearchCourtsPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function SearchCourtsPage(
	props: Readonly<SearchCourtsPageProps>,
): Promise<ReactNode> {
	const { searchParams } = props;

	const t = await getTranslations("SearchCourtsPage");
	const format = await getFormatter();

	const searchFilters = getSearchFilters(await searchParams);
	const searchResults = await getSearchResults(searchFilters);

	return (
		<div className="relative grid grid-cols-[auto_1fr]">
			<SearchSidePanel
				categoryFacetFilterLabel={t("facets.filter.category")}
				categoryFacetLabel={t("facets.category")}
				dateRangeLabel={t("date-range.label")}
				emptyDateCheckBoxLabel={t("date-range.empty-date-label")}
				label={t("search-filters")}
				searchFilters={searchFilters}
				searchResults={searchResults}
				searchTextFieldLabel={t("search")}
				statusFacetFilterLabel={t("facets.filter.status")}
				statusFacetLabel={t("facets.status")}
				thumbLabels={[t("date-range.start"), t("date-range.end")]}
				toggleLabel={t("toggle-sidepanel")}
			/>

			<MainContent>
				<header>
					<h1 className="sr-only">{t("title")}</h1>

					<div className="flex items-center gap-x-8 border-b border-brand-100 px-6 py-4 text-sm text-brand-600">
						<SidePanelToggle className="block lg:hidden" label={t("toggle-sidepanel")} />

						<div className="flex items-center gap-x-1.5 text-brand-600">
							<span>{t("search")}</span>
							<ChevronRightIcon aria-hidden={true} className="size-4 shrink-0" />
							<span>{t("courts")}</span>
						</div>

						<span className="ml-auto inline-flex items-center gap-x-4 text-xs font-medium">
							{t("search-results-count", { count: searchResults.count })}
							<DownloadDialog
								cancelLabel={t("download-cancel")}
								columns={[
									{ label: "ID", value: "id" },
									{ label: t("name"), value: "name" },
									{ label: t("expanded-name"), value: "expandedName" },
									{ label: t("kind"), value: "kind" },
									{ label: t("category"), value: "category" },
									{ label: t("type"), value: "type" },
									{ label: t("start-date"), value: "startDateWritten" },
									{ label: t("end-date"), value: "endDateWritten" },
									{ label: t("status"), value: "status" },
								]}
								count={searchResults.count}
								fileName={`viecpro-${isodate(new Date())}`}
								jsonLabel={t("download-json")}
								jsonShortLabel={t("file-json")}
								kind="court"
								label={t("download")}
								needsConfirmation={searchResults.count >= 1_000}
								searchFilters={searchFilters}
								submitLabel={t("download-submit")}
								title={t("download-title")}
								unsupportedLabel={t("download-too-big", {
									count: format.number(searchResults.count),
								})}
								xlsxLabel={t("download-xlsx")}
								xlsxShortLabel={t("file-xlsx")}
							>
								{t("download-confirm", { count: format.number(searchResults.count) })}
							</DownloadDialog>
						</span>
					</div>
				</header>

				<Suspense fallback={<LoadingIndicator />}>
					<SearchResults
						countLabel={t("search-results.count", {
							count: searchResults.count,
							page: format.number(searchResults.page),
							pages: format.number(searchResults.pages),
						})}
						nextPageLabel={t("search-results.next-page")}
						previousPageLabel={t("search-results.previous-page")}
						searchFilters={searchFilters}
						searchResults={searchResults}
					/>
				</Suspense>
			</MainContent>
		</div>
	);
}
