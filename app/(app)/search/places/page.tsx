import { ChevronRightIcon } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";
import { getFormatter, getTranslations } from "next-intl/server";
import { type ReactNode, Suspense } from "react";

import { SidePanelToggle } from "@/app/(app)/search/_components/side-panel-toggle";
import { SearchResults } from "@/app/(app)/search/places/_components/search-results";
import { SearchSidePanel } from "@/app/(app)/search/places/_components/search-side-panel";
import { getSearchFilters, getSearchResults } from "@/app/(app)/search/places/_lib/search";
import { DownloadDialog } from "@/components/download-dialog";
import { LoadingIndicator } from "@/components/loading-indicator";
import { MainContent } from "@/components/main-content";
import { isodate } from "@/lib/isodate";

interface SearchPlacesPageProps {
	searchParams: Promise<SearchParams>;
}

export async function generateMetadata(
	_props: Readonly<SearchPlacesPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const t = await getTranslations("SearchPlacesPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function SearchPlacesPage(
	props: Readonly<SearchPlacesPageProps>,
): Promise<ReactNode> {
	const { searchParams } = props;

	const t = await getTranslations("SearchPlacesPage");
	const format = await getFormatter();

	const searchFilters = getSearchFilters(await searchParams);
	const searchResults = await getSearchResults(searchFilters);

	return (
		<div className="relative grid grid-cols-[auto_1fr]">
			<SearchSidePanel
				categoryFacetFilterLabel={t("facets.filter.category")}
				categoryFacetLabel={t("facets.category")}
				closeLabel={t("close-search-filter-panel")}
				label={t("search-filters")}
				openLabel={t("open-search-filter-panel")}
				searchFilters={searchFilters}
				searchResults={searchResults}
				searchTextFieldLabel={t("search")}
				statusFacetFilterLabel={t("facets.filter.status")}
				statusFacetLabel={t("facets.status")}
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
								<span>{t("places")}</span>
							</div>
						</div>

						<span className="ml-auto inline-flex items-center gap-x-4 text-xs font-medium">
							<span className="hidden text-right xs:block">
								{t("search-results-count", { count: searchResults.count })}
							</span>
							<DownloadDialog
								cancelLabel={t("download-cancel")}
								columns={[
									{ label: "ID", value: "id" },
									{ label: "Name", value: "name" },
									{ label: "Type", value: "kind" },
									{ label: "Kategorie", value: "category" },
									{ label: "Latitude", value: "latitude" },
									{ label: "Longitude", value: "longitude" },
									{ label: "Status", value: "status" },
								]}
								count={searchResults.count}
								fileName={`viecpro-${isodate(new Date())}`}
								jsonLabel={t("download-json")}
								jsonShortLabel={t("file-json")}
								kind="place"
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
