"use client";

import type { IContent } from "json-as-xlsx";
import { DownloadIcon, FileJsonIcon, FileSpreadsheetIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button, Menu, MenuItem, MenuTrigger, Popover } from "react-aria-components";

import { downloadJson } from "@/lib/download-json";

interface DownloadMenuProps {
	columns: Array<{ label: string; value: string }>;
	data: object;
	fileName: string;
	jsonLabel: string;
	jsonShortLabel: string;
	label: ReactNode;
	xlsxLabel: string;
	xlsxShortLabel: string;
}

export function DownloadMenu(props: DownloadMenuProps): ReactNode {
	const { columns, data, fileName, jsonLabel, jsonShortLabel, label, xlsxLabel, xlsxShortLabel } =
		props;

	async function onAction(key: "json" | "xlsx") {
		switch (key) {
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
							content: [data as IContent],
						},
					],
					fileName,
				);

				break;
			}
		}
	}

	return (
		<MenuTrigger>
			<Button className="inline-flex items-center gap-x-2 rounded-md border border-brand-200 bg-brand-50 p-2 text-sm font-medium text-brand-600 transition hover:bg-brand-100 pressed:bg-brand-200 disabled:cursor-not-allowed disabled:opacity-50">
				<DownloadIcon className="size-5 shrink-0 text-brand-500" />
				<span>{label}</span>
			</Button>
			<Popover className="group min-w-[--trigger-width] max-w-72 rounded-lg border border-brand-100 bg-white shadow-lg">
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
