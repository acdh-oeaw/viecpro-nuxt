import {
	createUrl,
	createUrlSearchParams,
	groupBy,
	isNonEmptyArray,
	isNonEmptyString,
} from "@acdh-oeaw/lib";
import slugify from "@sindresorhus/slugify";
import { InfoIcon, NetworkIcon, StickyNoteIcon } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Fragment, type ReactNode } from "react";
import { Errors } from "typesense";

import { getInstitution } from "@/app/(app)/institutions/[id]/_lib/data";
import { StatusIndicator } from "@/app/(app)/search/_components/status-indicator";
import { Collapsible } from "@/components/collapsible";
import { DownloadMenu } from "@/components/download-menu";
import { Link } from "@/components/link";
import { MainContent } from "@/components/main-content";
import { PopoverNote } from "@/components/popover-note";
import { SortableTable } from "@/components/sortable-table";
import { Tooltip, TooltipTrigger } from "@/components/tooltip";
import { env } from "@/config/env.config";
import { parseLinks } from "@/lib/parse-links";

interface InstitutionPageProps {
	params: Promise<{
		id: string;
	}>;
}

export async function generateMetadata(
	props: Readonly<InstitutionPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { id: _id } = await params;
	const id = decodeURIComponent(_id);

	if (Number.isNaN(Number(id))) {
		notFound();
	}

	const data = await getInstitution(id).catch((error: unknown) => {
		if (error instanceof Errors.ObjectNotFound) {
			notFound();
		}

		throw error;
	});

	const metadata: Metadata = {
		// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
		title: data.expandedName || data.name,
	};

	return metadata;
}

export default async function InstitutionPage(
	props: Readonly<InstitutionPageProps>,
): Promise<ReactNode> {
	const { params } = props;

	const { id: _id } = await params;
	const id = decodeURIComponent(_id);

	const t = await getTranslations("InstitutionPage");

	const data = await getInstitution(id).catch((error: unknown) => {
		if (error instanceof Errors.ObjectNotFound) {
			notFound();
		}

		throw error;
	});

	const href = String(
		createUrl({
			baseUrl: env.NEXT_PUBLIC_APP_BASE_URL,
			pathname: `/institutions/${data.id}`,
		}),
	);

	return (
		<MainContent className="flex flex-col">
			<div className="mx-auto grid w-full max-w-7xl content-start gap-y-12 px-4 pt-8 pb-16 xs:gap-y-16 xs:px-8">
				<div className="grid content-start gap-y-4">
					<div>
						<span className="inline-flex items-center gap-x-2 text-xs font-bold tracking-wider text-brand-600 uppercase">
							{t("institution")}
							<div className="-mt-px">
								<StatusIndicator status={data.status} />
								<span className="sr-only">{data.status}</span>
							</div>
						</span>
						<h1 className="text-4xl font-bold tracking-tight text-brand-600">{data.name}</h1>
					</div>

					<div className="order-1 flex flex-wrap items-center justify-end gap-x-3 gap-y-2">
						<PopoverNote
							isDisabled={!isNonEmptyString(data.notes)}
							label={
								<Fragment>
									<StickyNoteIcon className="size-5 shrink-0 text-brand-500" />
									<span className="sr-only">{t("notes")}</span>
								</Fragment>
							}
							tooltip={t("notes")}
						>
							{data.notes}
						</PopoverNote>

						<TooltipTrigger>
							<Link
								className="inline-flex items-center gap-x-2 rounded-md border border-brand-200 bg-brand-50 p-2 text-sm font-medium text-brand-600 transition hover:bg-brand-100 focus-visible:focus-outline focus-visible:focus-outline-offset-0 pressed:bg-brand-200"
								href={`/hierarchy?${String(createUrlSearchParams({ kind: "institution", id }))}`}
							>
								<NetworkIcon className="size-5 shrink-0 text-brand-500" />
								<span className="sr-only">{t("hierarchy-visualisation")}</span>
							</Link>
							<Tooltip placement="bottom">{t("hierarchy-visualisation")}</Tooltip>
						</TooltipTrigger>

						<PopoverNote
							label={
								<Fragment>
									<InfoIcon className="size-5 shrink-0 text-brand-500" />
									<span className="sr-only">{t("citation")}</span>
								</Fragment>
							}
							tooltip={t("citation")}
						>
							<div className="grid gap-y-1">
								<div>
									{t("base-data")} - {t("institution")}
								</div>
								<div>{data.name}</div>
								{/* eslint-disable-next-line react/jsx-no-literals */}
								<div>VieCPro-ID: {data.id}</div>
								{/* eslint-disable-next-line react/jsx-no-literals */}
								<div>
									URI:{" "}
									<a className="underline hover:no-underline" href={href}>
										{href}
									</a>
								</div>
							</div>
						</PopoverNote>

						<DownloadMenu
							columns={[
								t("base-data"),
								[
									{ label: "ID", value: "id" },
									{ label: t("name"), value: "name" },
									{ label: t("expanded-name"), value: "expandedName" },
									{ label: t("kind"), value: "kind" },
									{ label: t("category"), value: "category" },
									{ label: t("type"), value: "type" },
									{ label: t("start-date"), value: "startDateWritten" },
									{ label: t("end-date"), value: "endDateWritten" },
									{ label: t("status"), value: "status" },
								],
							]}
							data={data}
							fileName={slugify(data.name)}
							jsonLabel={t("download-json")}
							jsonShortLabel={t("file-json")}
							label={t("download")}
							relations={[
								[
									{ value: "alternativeNames", label: t("alternative-names") },
									[
										{ value: "relationType", label: t("designation") },
										{ value: "startDateWritten", label: t("start-date") },
										{ value: "endDateWritten", label: t("end-date") },
									],
								],
								[
									{ value: "hierarchy", label: t("hierarchy") },
									[
										{ value: "relationType", label: t("relation-type") },
										{ value: "target.name", label: t("name") },
										{ value: "startDateWritten", label: t("start-date") },
										{ value: "endDateWritten", label: t("end-date") },
									],
								],
								[
									{ value: "locations", label: t("locations") },
									[
										{ value: "relationType", label: t("relation-type") },
										{ value: "target.name", label: t("name") },
										{ value: "startDateWritten", label: t("start-date") },
										{ value: "endDateWritten", label: t("end-date") },
									],
								],
								[
									{ value: "personnel", label: t("personnel") },
									[
										{ value: "relationType", label: t("function") },
										{ value: "target.name", label: t("name") },
										{ value: "startDateWritten", label: t("start-date") },
										{ value: "endDateWritten", label: t("end-date") },
									],
								],
							]}
							xlsxLabel={t("download-xlsx")}
							xlsxShortLabel={t("file-xlsx")}
						/>
					</div>
				</div>

				<div className="grid content-start gap-x-8 gap-y-12 lg:grid-cols-2">
					<section className="row-span-2 grid content-start gap-y-3">
						<h2 className="text-2xl text-brand-600">{t("section-data")}</h2>

						<dl className="mb-6 grid grid-cols-[auto_auto] justify-start gap-x-8 gap-y-2">
							<dt className="text-neutral-600">{t("expanded-name")}:</dt>
							<dd>{data.expandedName}</dd>

							<dt className="text-neutral-600">{t("category")}:</dt>
							<dd>{data.category}</dd>

							<dt className="text-neutral-600">{t("date-range")}:</dt>
							<dd>
								{[data.startDateWritten, data.endDateWritten].filter(isNonEmptyString).join(" - ")}
							</dd>
						</dl>

						<Collapsible
							isDisabled={!isNonEmptyArray(data.alternativeNames)}
							label={t("alternative-names")}
						>
							<SortableTable
								columns={[
									{
										field: "relationType",
										label: t("designation"),
										sort: "relationType",
										order: "string",
									},
									{
										field: "startDateWritten",
										label: t("start-date"),
										sort: "startDate",
										order: "number",
									},
									{
										field: "endDateWritten",
										label: t("end-date"),
										sort: "endDate",
										order: "number",
									},
								]}
								nextPageLabel={t("next-page")}
								previousPageLabel={t("previous-page")}
								rows={data.alternativeNames ?? []}
							/>
						</Collapsible>

						<Collapsible isDisabled={!isNonEmptyArray(data.references)} label={t("references")}>
							<div className="m-3 grid content-start gap-y-3">
								{Object.entries(
									groupBy(data.references ?? [], (item) => {
										return item.tag;
									}),
								).map(([tag, items]) => {
									return (
										<div key={tag} className="grid gap-y-0.5 text-sm">
											<h4 className="text-xs font-bold tracking-wider text-brand-600 uppercase">
												{tag}
											</h4>
											<ul className="grid gap-y-1" role="list">
												{items.map((item) => {
													return (
														<li key={item.id}>
															<span
																dangerouslySetInnerHTML={{
																	__html: parseLinks(
																		[item.shortTitle || item.title, item.folio]
																			.filter(isNonEmptyString)
																			.join(", "),
																	),
																}}
															/>
														</li>
													);
												})}
											</ul>
										</div>
									);
								})}
							</div>
						</Collapsible>

						<Collapsible isDisabled={!isNonEmptyArray(data.sameAs)} label={t("same-as")}>
							<ul className="m-3 grid gap-y-1 text-sm" role="list">
								{(data.sameAs ?? []).map((url, index) => {
									return (
										<li key={index}>
											<a className="underline hover:no-underline" href={url}>
												{url}
											</a>
										</li>
									);
								})}
							</ul>
						</Collapsible>
					</section>

					<section className="grid content-start gap-y-3">
						<h2 className="text-2xl text-brand-600">{t("section-relations")}</h2>

						<Collapsible isDisabled={!isNonEmptyArray(data.personnel)} label={t("personnel")}>
							<SortableTable
								columns={[
									{
										field: "relationType",
										label: t("function"),
										sort: "relationType",
										order: "string",
									},
									{
										field: "target",
										label: t("name"),
										sort: "target",
										order: "string",
									},
									{
										field: "startDateWritten",
										label: t("start-date"),
										sort: "startDate",
										order: "number",
									},
									{
										field: "endDateWritten",
										label: t("end-date"),
										sort: "endDate",
										order: "number",
									},
								]}
								nextPageLabel={t("next-page")}
								previousPageLabel={t("previous-page")}
								rows={data.personnel ?? []}
							/>
						</Collapsible>

						<Collapsible isDisabled={!isNonEmptyArray(data.locations)} label={t("locations")}>
							<SortableTable
								columns={[
									{
										field: "relationType",
										label: t("relation-type"),
										sort: "relationType",
										order: "string",
									},
									{
										field: "target",
										label: t("name"),
										sort: "target",
										order: "string",
									},
									{
										field: "startDateWritten",
										label: t("start-date"),
										sort: "startDate",
										order: "number",
									},
									{
										field: "endDateWritten",
										label: t("end-date"),
										sort: "endDate",
										order: "number",
									},
								]}
								nextPageLabel={t("next-page")}
								previousPageLabel={t("previous-page")}
								rows={data.locations ?? []}
							/>
						</Collapsible>

						<Collapsible isDisabled={!isNonEmptyArray(data.hierarchy)} label={t("hierarchy")}>
							<SortableTable
								columns={[
									{
										field: "relationType",
										label: t("relation-type"),
										sort: "relationType",
										order: "string",
									},
									{
										field: "target",
										label: t("name"),
										sort: "target",
										order: "string",
									},
									{
										field: "startDateWritten",
										label: t("start-date"),
										sort: "startDate",
										order: "number",
									},
									{
										field: "endDateWritten",
										label: t("end-date"),
										sort: "endDate",
										order: "number",
									},
								]}
								nextPageLabel={t("next-page")}
								previousPageLabel={t("previous-page")}
								rows={data.hierarchy ?? []}
							/>
						</Collapsible>
					</section>
				</div>
			</div>
		</MainContent>
	);
}
