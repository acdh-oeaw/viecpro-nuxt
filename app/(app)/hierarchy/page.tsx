import { ChevronRightIcon } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { type ReactNode, Suspense } from "react";

import { HierarchyVisualisation } from "@/app/(app)/hierarchy/_components/hierarchy-visualisation";
import { SearchFilterPanel } from "@/app/(app)/hierarchy/_components/search-filter-panel";
import { getAutocompleteData } from "@/app/(app)/hierarchy/_lib/autocomplete";
import {
	getSearchFilters,
	getSearchResults,
	type SearchFilters,
} from "@/app/(app)/hierarchy/_lib/hierarchy";
import { Link } from "@/components/link";
import { LoadingIndicator } from "@/components/loading-indicator";
import { MainContent } from "@/components/main-content";
import { colors } from "@/config/visualisation.config";

interface HierarchyPageProps {
	searchParams: Promise<SearchParams>;
}

export async function generateMetadata(
	_props: Readonly<HierarchyPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const t = await getTranslations("HierarchyPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function HierarchyPage(
	props: Readonly<HierarchyPageProps>,
): Promise<ReactNode> {
	const { searchParams } = props;

	const t = await getTranslations("HierarchyPage");

	const searchFilters = getSearchFilters(await searchParams);
	const isEnabled = searchFilters.kind != null && searchFilters.id != null;
	const data = isEnabled ? getSearchResults(searchFilters) : null;

	return (
		<MainContent className="grid grid-rows-[auto_1fr]">
			<h1 className="sr-only">{t("title")}</h1>

			<SearchPanel isEnabled={isEnabled} searchFilters={searchFilters} />

			<div className="relative">
				{data == null ? (
					<div className="grid h-full place-content-center text-brand-600">
						{t("nothing-selected")}
					</div>
				) : (
					<Suspense fallback={<LoadingIndicator />}>
						{/* @see https://viecpro-backend.acdh-ch-dev.oeaw.ac.at/visualisations/start/ */}
						<HierarchyVisualisation data={data} />
					</Suspense>
				)}

				<Legend />
			</div>
		</MainContent>
	);
}

const autocompletePromise = getAutocompleteData();

interface SearchPanelProps {
	isEnabled: boolean;
	searchFilters: SearchFilters;
}

async function SearchPanel(props: SearchPanelProps): Promise<ReactNode> {
	const { isEnabled, searchFilters } = props;

	const t = await getTranslations("HierarchyPage");

	const autocomplete = await autocompletePromise;

	function getGraphOptions() {
		if (!isEnabled) return [];

		switch (searchFilters.kind!) {
			case "institution": {
				return [
					{ id: "default", label: t("graph.institution-default") },
					{ id: "add functions", label: t("graph.institution-with-functions") },
					{
						id: "add functions and persons",
						label: t("graph.institution-with-functions-persons"),
					},
				];
			}

			case "person": {
				return [{ id: "default", label: t("graph.person-default") }];
			}

			case "function": {
				return [
					{ id: "default", label: t("graph.function-default") },
					{ id: "show amt and persons", label: t("graph.function-with-persons") },
				];
			}

			default: {
				return [];
			}
		}
	}

	const graphOptions = getGraphOptions();

	const directionOptions = [
		{ id: "up", label: t("direction.up") },
		{ id: "down", label: t("direction.down") },
	];

	return (
		<aside className="border-b border-brand-100 bg-brand-50 text-brand-900">
			<div className="flex flex-col flex-wrap gap-x-6 gap-y-4 p-4 xs:px-8 sm:flex-row sm:items-center sm:justify-between">
				<SearchFilterPanel
					directionOptions={directionOptions}
					directionSelectLabel={t("direction.label")}
					entities={autocomplete}
					entitiesComboBoxLabel={t("entity-combobox.label")}
					entitiesComboBoxTriggerLabel={t("entity-combobox.open")}
					graphOptions={graphOptions}
					graphSelectLabel={t("graph.label")}
					graphSelectPlaceholder={t("graph.none")}
					isGraphSelectEnabled={isEnabled}
					legendLabels={{
						function: t("legend.function"),
						institution: t("legend.institution"),
						person: t("legend.person"),
					}}
					searchFilters={searchFilters}
				/>

				{isEnabled ? (
					<Link
						className="mt-2 inline-flex items-center gap-x-2 self-end hover:underline"
						href={`/${String(searchFilters.kind)}s/${String(searchFilters.id)}`}
					>
						{t("view-details")}
						<ChevronRightIcon aria-hidden={true} className="size-5 shrink-0" />
					</Link>
				) : null}
			</div>
		</aside>
	);
}

function Legend(): ReactNode {
	const t = useTranslations("HierarchyPage");

	const types = ["institution", "function", "person"] as const;

	return (
		<aside
			aria-label={t("legend.title")}
			className="absolute right-8 bottom-3 flex items-center gap-x-4 rounded-md border border-brand-100 bg-brand-50 px-3 py-0.5 text-sm font-medium"
		>
			{types.map((type) => {
				return (
					<div key={type} className="inline-flex items-center gap-x-2">
						<div className="size-3 shrink-0 rounded-full" style={{ background: colors[type] }} />
						{t(`legend.${type}`)}
					</div>
				);
			})}
		</aside>
	);
}
