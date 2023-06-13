declare module "vue-instantsearch/vue3/es" {
	import { type Hit, type InstantSearchOptions } from "instantsearch.js";
	import { type AutocompleteConnectorParams } from "instantsearch.js/es/connectors/autocomplete/connectAutocomplete";
	import { type BreadcrumbConnectorParams } from "instantsearch.js/es/connectors/breadcrumb/connectBreadcrumb";
	import { type ClearRefinementsConnectorParams } from "instantsearch.js/es/connectors/clear-refinements/connectClearRefinements";
	import { type ConfigureConnectorParams } from "instantsearch.js/es/connectors/configure/connectConfigure";
	import { type ConfigureRelatedItemsConnectorParams } from "instantsearch.js/es/connectors/configure-related-items/connectConfigureRelatedItems";
	import { type CurrentRefinementsConnectorParams } from "instantsearch.js/es/connectors/current-refinements/connectCurrentRefinements";
	import { type DynamicWidgetsConnectorParams } from "instantsearch.js/es/connectors/dynamic-widgets/connectDynamicWidgets";
	import { type HierarchicalMenuConnectorParams } from "instantsearch.js/es/connectors/hierarchical-menu/connectHierarchicalMenu";
	import { type HitsConnectorParams } from "instantsearch.js/es/connectors/hits/connectHits";
	import { type HitsPerPageConnectorParams } from "instantsearch.js/es/connectors/hits-per-page/connectHitsPerPage";
	import { type InfiniteHitsConnectorParams } from "instantsearch.js/es/connectors/infinite-hits/connectInfiniteHits";
	import { type MenuConnectorParams } from "instantsearch.js/es/connectors/menu/connectMenu";
	import { type NumericMenuConnectorParams } from "instantsearch.js/es/connectors/numeric-menu/connectNumericMenu";
	import { type PaginationConnectorParams } from "instantsearch.js/es/connectors/pagination/connectPagination";
	import { type QueryRulesConnectorParams } from "instantsearch.js/es/connectors/query-rules/connectQueryRules";
	import { type RangeConnectorParams } from "instantsearch.js/es/connectors/range/connectRange";
	import { type RatingMenuConnectorParams } from "instantsearch.js/es/connectors/rating-menu/connectRatingMenu";
	import { type RefinementListConnectorParams } from "instantsearch.js/es/connectors/refinement-list/connectRefinementList";
	import { type SortByConnectorParams } from "instantsearch.js/es/connectors/sort-by/connectSortBy";
	import { type ToggleRefinementConnectorParams } from "instantsearch.js/es/connectors/toggle-refinement/connectToggleRefinement";
	import { type DefineComponent } from "vue";

	import { type Entity, type Reference, type Relation } from "@/utils/search/search-results.types";

	export type SearchResult = Hit<Entity | Reference | Relation>;

	export const AisAutocomplete: DefineComponent<
		AutocompleteConnectorParams & {
			"class-names"?: {
				"ais-Autocomplete"?: string;
			};
		}
	>;

	export const AisBreadcrumb: DefineComponent<
		BreadcrumbConnectorParams & {
			"class-names"?: {
				"ais-Breadcrumb"?: string;
				"ais-Breadcrumb--noRefinement"?: string;
				"ais-Breadcrumb-list"?: string;
				"ais-Breadcrumb-item"?: string;
				"ais-Breadcrumb-item--selected"?: string;
				"ais-Breadcrumb-separator"?: string;
				"ais-Breadcrumb-link"?: string;
			};
		}
	>;

	export const AisClearRefinements: DefineComponent<
		ClearRefinementsConnectorParams & {
			"class-names"?: {
				"ais-ClearRefinements"?: string;
				"ais-ClearRefinements-button"?: string;
				"ais-ClearRefinements-button--disabled"?: string;
			};
		}
	>;

	/** Note that props need to be camel-cased. */
	export const AisConfigure: DefineComponent<ConfigureConnectorParams["searchParameters"]>;

	/** Note that props need to be camel-cased. */
	export const AisExperimentalConfigureRelatedItems: DefineComponent<ConfigureRelatedItemsConnectorParams>;

	export const AisCurrentRefinements: DefineComponent<
		CurrentRefinementsConnectorParams & {
			"class-names"?: {
				"ais-CurrentRefinements"?: string;
				"ais-CurrentRefinements--noRefinement"?: string;
				"ais-CurrentRefinements-list"?: string;
				"ais-CurrentRefinements-item"?: string;
				"ais-CurrentRefinements-label"?: string;
				"ais-CurrentRefinements-delete"?: string;
			};
		}
	>;

	export const AisDynamicWidgets: DefineComponent<
		Pick<DynamicWidgetsConnectorParams, "facets" | "maxValuesPerFacet" | "transformItems">
	>;

	export const AisHierarchicalMenu: DefineComponent<
		HierarchicalMenuConnectorParams & {
			"class-names"?: {
				"ais-HierarchicalMenu"?: string;
				"ais-HierarchicalMenu--noRefinement"?: string;
				"ais-HierarchicalMenu-list"?: string;
				"ais-HierarchicalMenu-list--child"?: string;
				"ais-HierarchicalMenu-list--lvl0"?: string;
				"ais-HierarchicalMenu-list--lvl1"?: string;
				"ais-HierarchicalMenu-item"?: string;
				"ais-HierarchicalMenu-item--selected"?: string;
				"ais-HierarchicalMenu-item--parent"?: string;
				"ais-HierarchicalMenu-link"?: string;
				"ais-HierarchicalMenu-link--selected"?: string;
				"ais-HierarchicalMenu-label"?: string;
				"ais-HierarchicalMenu-count"?: string;
				"ais-HierarchicalMenu-showMore"?: string;
				"ais-HierarchicalMenu-showMore--disabled"?: string;
			};
		}
	>;

	export const AisHits: DefineComponent<
		HitsConnectorParams<SearchResult> & {
			"class-names"?: {
				"ais-Hits"?: string;
				"ais-Hits-list"?: string;
				"ais-Hits-item"?: string;
			};
		}
	>;

	export const AisHighlight: DefineComponent<{
		attribute: string;
		hit: Hit;
		/** @default "mark" */
		"highlighted-tag-name"?: string;
		"class-names"?: {
			"ais-Highlight"?: string;
			"ais-Highlight-highlighted"?: string;
		};
	}>;

	export const AisHitsPerPage: DefineComponent<
		HitsPerPageConnectorParams & {
			"class-names"?: {
				"ais-HitsPerPage"?: string;
				"ais-HitsPerPage-select"?: string;
				"ais-HitsPerPage-option"?: string;
			};
		}
	>;

	export const AisIndex: DefineComponent<{
		"index-name": string;
		"index-id"?: string;
	}>;

	export const AisInfiniteHits: DefineComponent<
		InfiniteHitsConnectorParams<SearchResult> & {
			"class-names"?: {
				"ais-InfiniteHits"?: string;
				"ais-InfiniteHits-list"?: string;
				"ais-InfiniteHits-item"?: string;
				"ais-InfiniteHits-loadPrevious"?: string;
				"ais-InfiniteHits-loadMore"?: string;
				"ais-InfiniteHits-loadPrevious--disabled"?: string;
				"ais-InfiniteHits-loadMore--disabled"?: string;
			};
		}
	>;

	export const AisInstantSearch: DefineComponent<
		Omit<InstantSearchOptions, "insights" | "numberLocale"> & {
			"class-names"?: {
				"ais-InstantSearch"?: string;
			};
		}
	>;

	export const AisMenu: DefineComponent<
		MenuConnectorParams & {
			"class-names"?: {
				"ais-Menu"?: string;
				"ais-Menu--noRefinement"?: string;
				"ais-Menu-list"?: string;
				"ais-Menu-item"?: string;
				"ais-Menu-item--selected"?: string;
				"ais-Menu-link"?: string;
				"ais-Menu-label"?: string;
				"ais-Menu-count"?: string;
				"ais-Menu-showMore"?: string;
				"ais-Menu-showMore--disabled"?: string;
			};
		}
	>;

	export const AisMenuSelect: DefineComponent<
		Omit<MenuConnectorParams, "showMore" | "showMoreLimit"> & {
			"class-names"?: {
				"ais-MenuSelect"?: string;
				"ais-MenuSelect--noRefinement"?: string;
				"ais-MenuSelect-select"?: string;
				"ais-MenuSelect-option"?: string;
			};
		}
	>;

	export const AisNumericMenu: DefineComponent<
		NumericMenuConnectorParams & {
			"class-names"?: {
				"ais-NumericMenu"?: string;
				"ais-NumericMenu--noRefinement"?: string;
				"ais-NumericMenu-list"?: string;
				"ais-NumericMenu-item"?: string;
				"ais-NumericMenu-item--selected"?: string;
				"ais-NumericMenu-label"?: string;
				"ais-NumericMenu-radio"?: string;
				"ais-NumericMenu-labelText"?: string;
			};
		}
	>;

	export const AisPagination: DefineComponent<
		PaginationConnectorParams & {
			/** @default true */
			"show-first"?: boolean;
			/** @default true */
			"show-previous"?: boolean;
			/** @default true */
			"show-next"?: boolean;
			/** @default true */
			"show-last"?: boolean;
			"class-names"?: {
				"ais-Pagination"?: string;
				"ais-Pagination--noRefinement"?: string;
				"ais-Pagination-list"?: string;
				"ais-Pagination-item"?: string;
				"ais-Pagination-item--firstPage"?: string;
				"ais-Pagination-item--lastPage"?: string;
				"ais-Pagination-item--previousPage"?: string;
				"ais-Pagination-item--nextPage"?: string;
				"ais-Pagination-item--page"?: string;
				"ais-Pagination-item--selected"?: string;
				"ais-Pagination-item--disabled"?: string;
				"ais-Pagination-link"?: string;
			};
		}
	>;

	export const AisPanel: DefineComponent<{
		"class-names"?: {
			"ais-Panel"?: string;
			"ais-Panel--noRefinement"?: string;
			"ais-Panel-header"?: string;
			"ais-Panel-body"?: string;
			"ais-Panel-footer"?: string;
		};
	}>;

	export const AisPoweredBy: DefineComponent<{
		theme?: string;
		"class-names"?: {
			"ais-PoweredBy"?: string;
			"ais-PoweredBy--light"?: string;
			"ais-PoweredBy--dark"?: string;
			"ais-PoweredBy-link"?: string;
			"ais-PoweredBy-logo"?: string;
		};
	}>;

	export const AisQueryRuleContext: DefineComponent<
		Pick<QueryRulesConnectorParams, "trackedFilters" | "transformRuleContexts">
	>;

	export const AisQueryRuleCustomData: DefineComponent<
		Pick<QueryRulesConnectorParams, "transformItems">
	>;

	export const AisRangeInput: DefineComponent<
		RangeConnectorParams & {
			"class-names"?: {
				"ais-RangeInput"?: string;
				"ais-RangeInput--noRefinement"?: string;
				"ais-RangeInput-form"?: string;
				"ais-RangeInput-separator"?: string;
				"ais-RangeInput-button"?: string;
				"ais-RangeInput-label"?: string;
				"ais-RangeInput-input"?: string;
				"ais-RangeInput-input--min"?: string;
				"ais-RangeInput-input--max"?: string;
			};
		}
	>;

	export const AisRatingMenu: DefineComponent<
		RatingMenuConnectorParams & {
			"class-names"?: {
				"ais-RatingMenu"?: string;
				"ais-RatingMenu-starSymbol"?: string;
				"ais-RatingMenu-starEmptySymbol"?: string;
				"ais-RatingMenu-list"?: string;
				"ais-RatingMenu-item"?: string;
				"ais-RatingMenu-link"?: string;
				"ais-RatingMenu-starIcon"?: string;
				"ais-RatingMenu-starIcon--full"?: string;
				"ais-RatingMenu-starIcon--empty"?: string;
				"ais-RatingMenu-label"?: string;
				"ais-RatingMenu-count"?: string;
			};
		}
	>;

	export const AisRefinementList: DefineComponent<
		RefinementListConnectorParams & {
			/** @default false */
			searchable?: boolean;
			/** @default "Search here..." */
			"searchable-placeholder"?: string;
			"class-names"?: {
				"ais-RefinementList"?: string;
				"ais-RefinementList--noRefinement"?: string;
				"ais-RefinementList-list"?: string;
				"ais-RefinementList-item"?: string;
				"ais-RefinementList-item--selected"?: string;
				"ais-RefinementList-label"?: string;
				"ais-RefinementList-labelText"?: string;
				"ais-RefinementList-checkbox "?: string;
				"ais-RefinementList-count"?: string;
				"ais-RefinementList-searchBox"?: string;
				"ais-RefinementList-noResults"?: string;
				"ais-RefinementList-showMore"?: string;
				"ais-RefinementList-showMore--disabled"?: string;
			};
		}
	>;

	export const AisRelevantSort: DefineComponent<{
		"class-names"?: {
			"ais-RelevantSort"?: string;
			"ais-RelevantSort-text"?: string;
			"ais-RelevantSort-button"?: string;
		};
	}>;

	export const AisSearchBox: DefineComponent<{
		/** @default false */
		autofocus?: boolean;
		/** @default "Search here..." */
		placeholder?: string;
		/** @default "clear" */
		"reset-title"?: string;
		/** @default false */
		"show-loading-indicator"?: boolean;
		/** @default "search" */
		"submit-title"?: string;
		"class-names"?: {
			"ais-SearchBox"?: string;
			"ais-SearchBox-form"?: string;
			"ais-SearchBox-input"?: string;
			"ais-SearchBox-submit"?: string;
			"ais-SearchBox-submitIcon"?: string;
			"ais-SearchBox-reset"?: string;
			"ais-SearchBox-resetIcon"?: string;
			"ais-SearchBox-loadingIndicator"?: string;
			"ais-SearchBox-loadingIcon"?: string;
		};
	}>;

	export const AisSnippet: DefineComponent<{
		attribute: string;
		hit: Hit;
		/** @default "mark" */
		"highlighted-tag-name"?: string;
		"class-names"?: {
			"ais-Snippet"?: string;
		};
	}>;

	export const AisSortBy: DefineComponent<
		SortByConnectorParams & {
			"class-names"?: {
				"ais-SortBy"?: string;
				"ais-SortBy-select"?: string;
				"ais-SortBy-option"?: string;
			};
		}
	>;

	export const AisStateResults: DefineComponent<{
		/** @default false */
		"catch-error"?: boolean;
	}>;

	export const AisStats: DefineComponent<{
		"class-names"?: {
			"ais-Stats"?: string;
			"ais-Stats-text"?: string;
		};
	}>;

	export const AisToggleRefinement: DefineComponent<
		ToggleRefinementConnectorParams & {
			label: string;
			"class-names"?: {
				"ais-ToggleRefinement"?: string;
				"ais-ToggleRefinement--noRefinement"?: string;
				"ais-ToggleRefinement-label"?: string;
				"ais-ToggleRefinement-checkbox"?: string;
				"ais-ToggleRefinement-labelText"?: string;
				"ais-ToggleRefinement-count"?: string;
			};
		}
	>;
}
