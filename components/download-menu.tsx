"use client";

import type { IContent, IJsonSheet } from "json-as-xlsx";
import { DownloadIcon, FileJsonIcon, FileSpreadsheetIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button, Menu, MenuItem, MenuTrigger, Popover } from "react-aria-components";

import { Tooltip, TooltipTrigger } from "@/components/tooltip";
import { downloadJson } from "@/lib/download-json";

interface DownloadMenuProps<T extends object> {
	columns: [string, Array<{ label: string; value: string }>];
	data: T;
	fileName: string;
	jsonLabel: string;
	jsonShortLabel: string;
	label: ReactNode;
	relations: Array<[{ label: string; value: keyof T }, Array<{ label: string; value: string }>]>;
	xlsxLabel: string;
	xlsxShortLabel: string;
}

export function DownloadMenu<T extends object>(props: DownloadMenuProps<T>): ReactNode {
	const {
		columns: base,
		data,
		fileName,
		jsonLabel,
		jsonShortLabel,
		label,
		relations,
		xlsxLabel,
		xlsxShortLabel,
	} = props;

	async function onAction(key: "json" | "xlsx") {
		switch (key) {
			case "json": {
				downloadJson(data, `${fileName}.json`);

				break;
			}

			case "xlsx": {
				const { downloadXlsx } = await import("@/lib/download-xlsx");

				const [sheet, columns] = base;

				const sheets: Array<IJsonSheet> = [{ columns, content: [data as IContent], sheet }];

				relations.forEach(([{ label, value }, columns]) => {
					const content = data[value] as Array<IContent> | undefined;

					if (content != null) {
						sheets.push({ columns, content, sheet: label.slice(0, 31) });
					}
				});

				downloadXlsx(sheets, fileName);

				break;
			}
		}
	}

	return (
		<MenuTrigger>
			<TooltipTrigger>
				<Button className="inline-flex items-center gap-x-2 rounded-md border border-brand-200 bg-brand-50 p-2 text-sm font-medium text-brand-600 transition hover:bg-brand-100 pressed:bg-brand-200 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:focus-outline focus-visible:focus-outline-offset-0">
					<DownloadIcon className="size-5 shrink-0 text-brand-500" />
					<span className="sr-only">{label}</span>
				</Button>
				<Tooltip placement="bottom">{label}</Tooltip>
			</TooltipTrigger>
			<Popover
				className="group min-w-[var(--trigger-width)] max-w-72 rounded-lg border border-brand-100 bg-white shadow-lg animate-in fade-in slide-in-from-top-2"
				placement="bottom right"
			>
				<Menu className="py-2 text-sm outline-none">
					<MenuItem
						className="flex cursor-default gap-x-2 rounded px-3 py-2 transition hover:bg-brand-50"
						onAction={() => {
							void onAction("json");
						}}
					>
						<FileJsonIcon aria-hidden={true} className="size-5 shrink-0" />
						<span aria-hidden={true}>{jsonShortLabel}</span>
						<span className="sr-only">{jsonLabel}</span>
					</MenuItem>
					<MenuItem
						className="flex cursor-default gap-x-2 rounded px-3 py-2 transition hover:bg-brand-50"
						onAction={() => {
							void onAction("xlsx");
						}}
					>
						<FileSpreadsheetIcon aria-hidden={true} className="size-5 shrink-0" />
						<span aria-hidden={true}>{xlsxShortLabel}</span>
						<span className="sr-only">{xlsxLabel}</span>
					</MenuItem>
				</Menu>
			</Popover>
		</MenuTrigger>
	);
}
