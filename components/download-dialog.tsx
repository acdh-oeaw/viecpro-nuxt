"use client";

import type { IContent } from "json-as-xlsx";
import { DownloadIcon, FileJsonIcon, FileSpreadsheetIcon, Loader2Icon, XIcon } from "lucide-react";
import { Fragment, type ReactNode, useState } from "react";
import { chain } from "react-aria";
import {
	Button,
	Dialog,
	Heading,
	Menu,
	MenuItem,
	MenuTrigger,
	Modal,
	ModalOverlay,
	Popover,
} from "react-aria-components";
import { useOverlayTriggerState } from "react-stately";

import {
	downloadCollection as downloadCourts,
	isDownloadUnsupported as isCourtsDownloadUnsupported,
	type SearchFilters as CourtSearchFilters,
} from "@/app/(app)/search/courts/_lib/search";
import {
	downloadCollection as downloadInstitutions,
	isDownloadUnsupported as isInstitutionsDownloadUnsupported,
	type SearchFilters as InstitutionSearchFilters,
} from "@/app/(app)/search/institutions/_lib/search";
import {
	downloadCollection as downloadPersons,
	isDownloadUnsupported as isPersonsDownloadUnsupported,
	type SearchFilters as PersonSearchFilters,
} from "@/app/(app)/search/persons/_lib/search";
import {
	downloadCollection as downloadPlaces,
	isDownloadUnsupported as isPlacesDownloadUnsupported,
	type SearchFilters as PlaceSearchFilters,
} from "@/app/(app)/search/places/_lib/search";
import { Tooltip, TooltipTrigger } from "@/components/tooltip";
import { downloadJson } from "@/lib/download-json";

type DownloadDialogProps = {
	cancelLabel: ReactNode;
	children: ReactNode;
	columns: Array<{ label: string; value: string }>;
	count: number;
	fileName: string;
	jsonLabel: string;
	jsonShortLabel: string;
	label: ReactNode;
	needsConfirmation: boolean;
	submitLabel: ReactNode;
	title: ReactNode;
	unsupportedLabel: ReactNode;
	xlsxLabel: string;
	xlsxShortLabel: string;
} & (
	| {
			kind: "court";
			searchFilters: CourtSearchFilters;
	  }
	| {
			kind: "institution";
			searchFilters: InstitutionSearchFilters;
	  }
	| {
			kind: "person";
			searchFilters: PersonSearchFilters;
	  }
	| {
			kind: "place";
			searchFilters: PlaceSearchFilters;
	  }
);

export function DownloadDialog(props: DownloadDialogProps): ReactNode {
	const {
		cancelLabel,
		children,
		columns,
		count,
		fileName,
		jsonLabel,
		jsonShortLabel,
		kind,
		label,
		needsConfirmation,
		searchFilters,
		submitLabel,
		title,
		unsupportedLabel,
		xlsxLabel,
		xlsxShortLabel,
	} = props;

	const state = useOverlayTriggerState({});
	const [action, setAction] = useState<"json" | "xlsx" | null>(null);

	function isDownloadUnsupported() {
		switch (kind) {
			case "court": {
				return isCourtsDownloadUnsupported(count);
			}

			case "institution": {
				return isInstitutionsDownloadUnsupported(count);
			}

			case "person": {
				return isPersonsDownloadUnsupported(count);
			}

			case "place": {
				return isPlacesDownloadUnsupported(count);
			}
		}
	}

	async function getSearchResults() {
		switch (kind) {
			case "court": {
				return downloadCourts(searchFilters, count);
			}

			case "institution": {
				return downloadInstitutions(searchFilters, count);
			}

			case "person": {
				return downloadPersons(searchFilters, count);
			}

			case "place": {
				return downloadPlaces(searchFilters, count);
			}
		}
	}

	const [status, setStatus] = useState<"idle" | "pending">("idle");

	async function download(action: "json" | "xlsx") {
		setStatus("pending");

		try {
			const data = await getSearchResults();

			switch (action) {
				case "json": {
					downloadJson(data, `${fileName}.json`);
					break;
				}

				case "xlsx": {
					const { downloadXlsx } = await import("@/lib/download-xlsx");

					downloadXlsx(
						[
							{
								columns,
								content: data as unknown as Array<IContent>,
							},
						],
						fileName,
					);

					break;
				}
			}
		} catch {
			// TODO:
		} finally {
			setStatus("idle");
		}
	}

	async function onSubmit() {
		if (action != null) {
			await download(action);
			setAction(null);
		}
	}

	function onAction(action: "json" | "xlsx") {
		setAction(action);

		if (needsConfirmation) {
			state.open();
		} else {
			void download(action);
		}
	}

	return (
		<Fragment>
			<MenuTrigger>
				<TooltipTrigger>
					<Button
						className="inline-flex items-center gap-x-2 rounded-md border border-brand-200 bg-brand-50 p-2 text-sm font-medium text-brand-600 transition hover:bg-brand-100 pressed:bg-brand-200 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:focus-outline focus-visible:focus-outline-offset-0"
						isDisabled={status === "pending"}
					>
						{status === "pending" ? (
							<Loader2Icon className="size-5 shrink-0 animate-spin text-brand-500" />
						) : (
							<DownloadIcon className="size-5 shrink-0 text-brand-500" />
						)}
						<span className="sr-only">{label}</span>
					</Button>
					<Tooltip placement="left">{label}</Tooltip>
				</TooltipTrigger>
				<Popover
					className="group min-w-[var(--trigger-width)] max-w-72 rounded-lg border border-brand-100 bg-white shadow-lg animate-in fade-in slide-in-from-top-2"
					placement="bottom right"
				>
					<Menu className="py-2 text-sm outline-none">
						<MenuItem
							className="flex cursor-default gap-x-2 rounded px-3 py-2 transition hover:bg-brand-50"
							onAction={() => {
								onAction("json");
							}}
						>
							<FileJsonIcon aria-hidden={true} className="size-5 shrink-0" />
							<span aria-hidden={true}>{jsonShortLabel}</span>
							<span className="sr-only">{jsonLabel}</span>
						</MenuItem>
						<MenuItem
							className="flex cursor-default gap-x-2 rounded px-3 py-2 transition hover:bg-brand-50"
							onAction={() => {
								onAction("xlsx");
							}}
						>
							<FileSpreadsheetIcon aria-hidden={true} className="size-5 shrink-0" />
							<span aria-hidden={true}>{xlsxShortLabel}</span>
							<span className="sr-only">{xlsxLabel}</span>
						</MenuItem>
					</Menu>
				</Popover>
			</MenuTrigger>

			<ModalOverlay
				className="fixed inset-0 z-10 grid min-h-full place-content-center place-items-center overflow-y-auto bg-black/25 p-4 text-center backdrop-blur-sm"
				isOpen={state.isOpen}
				onOpenChange={() => {
					state.toggle();
				}}
			>
				<Modal className="m-8 w-full max-w-screen-md overflow-hidden rounded-lg border border-brand-100 bg-white p-6 shadow-lg">
					<Dialog className="relative grid gap-y-4 text-left text-brand-950 outline-none">
						{({ close }) => {
							return (
								<Fragment>
									<Heading
										className="pr-12 font-heading text-lg font-bold text-brand-600"
										slot="title"
									>
										{title}
									</Heading>
									<Button className="absolute right-0 top-0" slot="close">
										<span className="sr-only"></span>
										<XIcon
											aria-hidden={true}
											className="size-5 text-brand-500 hover:text-brand-600 pressed:text-brand-700"
										/>
									</Button>
									<div className="text-brand-600">
										{!isDownloadUnsupported() ? children : unsupportedLabel}
									</div>
									<footer className="mt-2 flex justify-end gap-x-2">
										{!isDownloadUnsupported() ? (
											<Button
												className="inline-flex items-center gap-x-2 rounded-md border border-brand-600 bg-brand-600 p-2 text-sm font-medium text-white transition hover:border-brand-700 hover:bg-brand-700 pressed:border-brand-800 pressed:bg-brand-800"
												onPress={chain(onSubmit, close)}
											>
												{submitLabel}
											</Button>
										) : null}
										<Button
											className="inline-flex items-center gap-x-2 rounded-md border border-brand-200 bg-brand-50 p-2 text-sm font-medium text-brand-600 transition hover:bg-brand-100 pressed:bg-brand-200"
											slot="close"
										>
											{cancelLabel}
										</Button>
									</footer>
								</Fragment>
							);
						}}
					</Dialog>
				</Modal>
			</ModalOverlay>
		</Fragment>
	);
}
