"use client";

import { XIcon } from "lucide-react";
import { useFormatter } from "next-intl";
import { type ChangeEvent, type ReactNode, useEffect, useId, useState } from "react";
import { Button, Input, Label, SearchField } from "react-aria-components";

import {
	type FacetField as CourtFacetField,
	type FacetValueCount as CourtFacetValueCount,
	getSearchFacetValues as getCourtSearchFacetValues,
	type SearchFilters as CourtSearchFilters,
} from "@/app/(app)/search/courts/_lib/search";
import {
	type FacetField as InstitutionFacetField,
	type FacetValueCount as InstitutionFacetValueCount,
	getSearchFacetValues as getInstitutionSearchFacetValues,
	type SearchFilters as InstitutionSearchFilters,
} from "@/app/(app)/search/institutions/_lib/search";
import {
	type FacetField as PersonFacetField,
	type FacetValueCount as PersonFacetValueCount,
	getSearchFacetValues as getPersonSearchFacetValues,
	type SearchFilters as PersonSearchFilters,
} from "@/app/(app)/search/persons/_lib/search";
import {
	type FacetField as PlaceFacetField,
	type FacetValueCount as PlaceFacetValueCount,
	getSearchFacetValues as getPlaceSearchFacetValues,
	type SearchFilters as PlaceSearchFilters,
} from "@/app/(app)/search/places/_lib/search";
import { defaultFacets, maxFacets } from "@/config/search.config";

// FIXME: shared types
type FacetValueCount =
	| CourtFacetValueCount
	| InstitutionFacetValueCount
	| PersonFacetValueCount
	| PlaceFacetValueCount;

type SearchFacetsProps = {
	filterLabel: ReactNode;
	label: ReactNode;
	selectedKeys: Set<string>;
} & (
	| {
			kind: "court";
			options: Array<CourtFacetValueCount>;
			name: CourtFacetField;
			searchFilters: CourtSearchFilters;
			onFacetChange: (name: CourtFacetField, value: string, isSelected: boolean) => void;
	  }
	| {
			kind: "institution";
			options: Array<InstitutionFacetValueCount>;
			name: InstitutionFacetField;
			searchFilters: InstitutionSearchFilters;
			onFacetChange: (name: InstitutionFacetField, value: string, isSelected: boolean) => void;
	  }
	| {
			kind: "person";
			options: Array<PersonFacetValueCount>;
			name: PersonFacetField;
			searchFilters: PersonSearchFilters;
			onFacetChange: (name: PersonFacetField, value: string, isSelected: boolean) => void;
	  }
	| {
			kind: "place";
			options: Array<PlaceFacetValueCount>;
			name: PlaceFacetField;
			searchFilters: PlaceSearchFilters;
			onFacetChange: (name: PlaceFacetField, value: string, isSelected: boolean) => void;
	  }
);

export function SearchFacets(props: SearchFacetsProps): ReactNode {
	const { filterLabel, kind, label, name, onFacetChange, options, searchFilters, selectedKeys } =
		props;

	const id = useId();

	const format = useFormatter();

	const [isShowingMore, setIsShowingMore] = useState(false);

	function toggleIsShowingMore() {
		setIsShowingMore((isShowingMore) => {
			return !isShowingMore;
		});
	}

	const [filterSearchTerm, setFilterSearchTerm] = useState("");
	const [filteredFacetValues, setFilteredFacetValues] = useState<Array<FacetValueCount> | null>(
		null,
	);

	function onFilter(value: string): void {
		setFilterSearchTerm(value);
	}

	useEffect(() => {
		if (filterSearchTerm.trim().length === 0) {
			setFilteredFacetValues(null);
			return;
		}

		let isCanceled = false;

		async function run() {
			function getSearchFacetValues() {
				switch (kind) {
					case "court": {
						return getCourtSearchFacetValues(searchFilters, name, filterSearchTerm);
					}

					case "institution": {
						return getInstitutionSearchFacetValues(searchFilters, name, filterSearchTerm);
					}

					case "person": {
						return getPersonSearchFacetValues(searchFilters, name, filterSearchTerm);
					}

					case "place": {
						return getPlaceSearchFacetValues(searchFilters, name, filterSearchTerm);
					}
				}
			}

			const filteredValues = await getSearchFacetValues();
			if (!isCanceled) {
				setFilteredFacetValues(filteredValues.values);
			}
		}

		void run();

		return () => {
			isCanceled = true;
		};
	}, [filterSearchTerm, kind, name, searchFilters]);

	if (options.length === 0) {
		return null;
	}

	return (
		<div aria-labelledby={id} className="grid gap-y-2" role="group">
			<h3 className="text-xs font-bold tracking-wider text-brand-600 uppercase" id={id}>
				{label}
			</h3>
			{options.length > maxFacets ? (
				<SearchField className="group grid gap-y-2" onChange={onFilter} value={filterSearchTerm}>
					<Label className="sr-only">{filterLabel}</Label>
					<div className="relative">
						<Input className="w-full border border-brand-100 bg-white py-0.5 pr-9 pl-3 focus-visible:focus-outline focus-visible:focus-outline-offset-0" />
						<Button className="absolute inset-y-0 right-3 group-empty:hidden">
							<XIcon aria-hidden={true} className="size-4 text-brand-600" />
						</Button>
					</div>
				</SearchField>
			) : null}
			<div className="grid gap-1 text-sm text-brand-600">
				{(filteredFacetValues ?? options)
					.slice(0, isShowingMore ? maxFacets : defaultFacets)
					.map(({ count, isSelected: _isSelected, value }) => {
						function onChange(event: ChangeEvent<HTMLInputElement>): void {
							// @ts-expect-error TODO: improve types
							onFacetChange(name, value, event.currentTarget.checked);
						}

						/** Prefer selection info from optimistic search filters. */
						const isSelected = selectedKeys.has(value);

						return (
							<label key={value} className="inline-flex gap-x-1.5 accent-brand-600">
								<span className="inline-flex h-[1lh] items-center">
									<input
										checked={isSelected}
										className="h-[1lh]"
										name={name}
										onChange={onChange}
										type="checkbox"
										value={value}
									/>
								</span>
								<span className="flex-1">{value}</span>
								<span className="inline-flex h-[1lh] items-center">
									<span className="text-xs font-medium">{format.number(count)}</span>
								</span>
							</label>
						);
					})}
			</div>
			{options.length > defaultFacets ? (
				<Button className="text-sm text-brand-600 hover:underline" onPress={toggleIsShowingMore}>
					{isShowingMore ? "Weniger anzeigen" : "Mehr anzeigen"}
				</Button>
			) : null}
		</div>
	);
}
