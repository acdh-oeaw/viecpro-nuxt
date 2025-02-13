"use client";

import { ChevronLeftIcon, ChevronRightIcon, SortAscIcon, SortDescIcon } from "lucide-react";
import { Fragment, type ReactNode, useMemo, useState } from "react";
import { Button } from "react-aria-components";

import { Link } from "@/components/link";

interface SortableTableProps<T extends object> {
	columns: Array<{
		field: keyof T & string;
		label: string;
		sort: keyof T & string;
		order: "number" | "string";
	}>;
	rows: Array<T>;
	previousPageLabel: string;
	nextPageLabel: string;
}

// FIXME: this currently depends on the hard-coded assumption that fields named "target"
// need to be treated as relation fields
//
// we should just extract the sorting and pagination in a custom hook,
// and render individual table components for each case

export function SortableTable<T extends object>(props: SortableTableProps<T>): ReactNode {
	const { columns, nextPageLabel, previousPageLabel, rows } = props;

	const [currentSortColumn, setCurrentSortColumn] = useState(columns.at(0)!);
	const [currentSortDirection, setCurrentSortDirection] = useState<"asc" | "desc">("asc");
	const [currentPage, setCurrentPage] = useState(1);

	const limit = 10;
	const pages = Math.ceil(rows.length / limit);
	const hasNextPage = currentPage < pages;
	const hasPreviousPage = currentPage > 1;

	const visibleRows = useMemo(() => {
		const visibleRows = rows.slice();

		visibleRows.sort((_a, _z) => {
			if (currentSortColumn.field === "target") {
				const a = _a[currentSortColumn.sort] as { name: string };
				const z = _z[currentSortColumn.sort] as { name: string };
				return a.name.localeCompare(z.name);
			}

			if (currentSortColumn.order === "number") {
				const a = (_a[currentSortColumn.sort] as number | null) ?? 0;
				const z = (_z[currentSortColumn.sort] as number | null) ?? 0;
				return a - z;
			}

			const a = (_a[currentSortColumn.sort] as string | null) ?? "";
			const z = (_z[currentSortColumn.sort] as string | null) ?? "";
			return a.localeCompare(z);
		});

		if (currentSortDirection === "desc") {
			visibleRows.reverse();
		}

		return visibleRows.slice((currentPage - 1) * limit, currentPage * limit);
	}, [rows, currentSortColumn, currentSortDirection, currentPage]);

	if (visibleRows.length === 0) {
		return null;
	}

	return (
		<Fragment>
			<div className="w-full overflow-x-auto">
				<table className="min-w-full text-brand-950 text-sm">
					<thead>
						<tr className="border-b border-brand-100">
							{columns.map((column) => {
								return (
									<th
										key={column.field}
										className="text-left text-xs font-bold uppercase tracking-wider text-brand-600"
									>
										<Button
											className="inline-flex w-full items-center justify-between gap-x-4 px-4 py-3 transition hover:bg-brand-50 focus-visible:focus-outline focus-visible:-focus-outline-offset-2"
											onPress={() => {
												if (column.sort === currentSortColumn.sort) {
													setCurrentSortDirection((currentSortDirection) => {
														return currentSortDirection === "asc" ? "desc" : "asc";
													});
													setCurrentPage(1);
												} else {
													setCurrentSortColumn(column);
													setCurrentSortDirection("asc");
													setCurrentPage(1);
												}
											}}
											type="button"
										>
											<span className="uppercase whitespace-nowrap">{column.label}</span>
											{column.sort === currentSortColumn.sort ? (
												currentSortDirection === "desc" ? (
													<SortDescIcon
														aria-hidden={true}
														className="size-4 shrink-0 text-brand-400 data-[pending]:animate-pulse"
													/>
												) : (
													<SortAscIcon
														aria-hidden={true}
														className="size-4 shrink-0 text-brand-400 data-[pending]:animate-pulse"
													/>
												)
											) : null}
										</Button>
									</th>
								);
							})}
						</tr>
					</thead>
					<tbody className="divide-y divide-neutral-200">
						{visibleRows.map((row, index) => {
							return (
								<tr key={index} className="relative">
									{columns.map((column) => {
										if (column.field === "target") {
											const value = row[column.field] as { kind: string; id: string; name: string };

											return (
												<td
													key={column.field}
													className="px-3 py-2.5 whitespace-nowrap truncate max-w-sm"
													// @ts-expect-error TODO: fix a11y
													title={value}
												>
													<Link
														className="after:absolute after:inset-0 hover:after:bg-brand-600/5 focus-visible:after:focus-outline focus-visible:after:-focus-outline-offset-2"
														href={`/${value.kind}s/${String(value.id)}`}
													>
														{value.name}
													</Link>
												</td>
											);
										}

										const value = row[column.field] as string | number | null;

										return (
											<td
												key={column.field}
												className="px-3 py-2.5 whitespace-nowrap truncate max-w-sm"
												// @ts-expect-error TODO: fix a11y
												title={value}
											>
												{value}
											</td>
										);
									})}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			{hasPreviousPage || hasNextPage ? (
				<footer className="text-sm flex px-3 justify-between items-center my-3">
					<span className="text-xs">
						{/* eslint-disable-next-line react/jsx-no-literals */}
						{(currentPage - 1) * limit + 1} - {(currentPage - 1) * limit + visibleRows.length} von{" "}
						{rows.length}
					</span>
					<span className="inline-flex items-center gap-x-6 sm:ml-auto">
						<Button
							className="inline-flex items-center gap-x-1.5 hover:underline disabled:opacity-50 focus-visible:focus-outline"
							isDisabled={!hasPreviousPage}
							onPress={() => {
								setCurrentPage((currentPage) => {
									return currentPage - 1;
								});
							}}
							type="button"
						>
							<ChevronLeftIcon aria-hidden={true} className="size-4 shrink-0 text-brand-400" />
							{previousPageLabel}
						</Button>
						<Button
							className="inline-flex items-center gap-x-1.5 hover:underline disabled:opacity-50 focus-visible:focus-outline"
							isDisabled={!hasNextPage}
							onPress={() => {
								setCurrentPage((currentPage) => {
									return currentPage + 1;
								});
							}}
							type="button"
						>
							{nextPageLabel}
							<ChevronRightIcon aria-hidden={true} className="size-4 shrink-0 text-brand-400" />
						</Button>
					</span>
				</footer>
			) : null}
		</Fragment>
	);
}
