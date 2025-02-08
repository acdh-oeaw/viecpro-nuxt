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
import { getFormatter, getTranslations } from "next-intl/server";
import { Fragment, type ReactNode } from "react";
import { Errors } from "typesense";

import { getPerson } from "@/app/(app)/persons/[id]/_lib/data";
import { StatusIndicator } from "@/app/(app)/search/_components/status-indicator";
import { Collapsible } from "@/components/collapsible";
import { DownloadMenu } from "@/components/download-menu";
import { Link } from "@/components/link";
import { MainContent } from "@/components/main-content";
import { PopoverNote } from "@/components/popover-note";
import { Tooltip, TooltipTrigger } from "@/components/tooltip";
import { env } from "@/config/env.config";
import { parseLinks } from "@/lib/parse-links";

interface PersonPageProps {
	params: Promise<{
		id: string;
	}>;
}

export async function generateMetadata(
	props: Readonly<PersonPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { id: _id } = await params;
	const id = decodeURIComponent(_id);

	if (Number.isNaN(Number(id))) {
		notFound();
	}

	try {
		const data = await getPerson(id);

		const metadata: Metadata = {
			title: [data.firstName, data.name].filter(isNonEmptyString).join(" "),
		};

		return metadata;
	} catch (error) {
		if (error instanceof Errors.ObjectNotFound) {
			notFound();
		}

		throw error;
	}
}

export default async function PersonPage(props: Readonly<PersonPageProps>): Promise<ReactNode> {
	const { params } = props;

	const { id: _id } = await params;
	const id = decodeURIComponent(_id);

	const t = await getTranslations("PersonPage");
	const format = await getFormatter();

	const data = await getPerson(id);

	const href = String(
		createUrl({
			baseUrl: env.NEXT_PUBLIC_APP_BASE_URL,
			pathname: `/persons/${data.id}`,
		}),
	);

	return (
		<MainContent className="flex flex-col">
			<div className="mx-auto grid w-full max-w-7xl content-start gap-y-12 px-4 pt-8 pb-16 xs:gap-y-16 xs:px-8">
				<div className="grid content-start gap-y-4">
					<div>
						<span className="inline-flex items-center gap-x-2 text-xs font-bold uppercase tracking-wider text-brand-600">
							{t("person")}
							<div>
								<StatusIndicator status={data.status} />
								<span className="sr-only">{data.status}</span>
							</div>
						</span>
						<h1 className="text-4xl font-bold tracking-tight text-brand-600">
							{[data.firstName, data.name].filter(isNonEmptyString).join(" ")}
						</h1>
					</div>

					<div className="order-first flex flex-wrap items-center justify-end gap-x-3 gap-y-2">
						<PopoverNote
							isDisabled={!isNonEmptyString(data.notes)}
							label={
								<Fragment>
									<StickyNoteIcon className="size-5 shrink-0 text-brand-500" />
									<span className="sr-only">{t("notes")}</span>
								</Fragment>
							}
						>
							{data.notes}
						</PopoverNote>

						<TooltipTrigger>
							<Link
								className="inline-flex items-center gap-x-2 rounded-md border border-brand-200 bg-brand-50 p-2 text-sm font-medium text-brand-600 transition hover:bg-brand-100 pressed:bg-brand-200 focus-visible:focus-outline focus-visible:focus-outline-offset-0"
								href={`/hierarchy?${String(createUrlSearchParams({ kind: "person", id }))}`}
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
						>
							<div className="grid gap-y-1">
								<div>
									{t("base-data")} - {t("person")}
								</div>
								<div>{[data.firstName, data.name].filter(isNonEmptyString).join(" ")}</div>
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
								{ label: "ID", value: "id" },
								{ label: t("first-name"), value: "firstName" },
								{ label: t("name"), value: "name" },
								{ label: t("kind"), value: "kind" },
								{ label: t("gender"), value: "gender" },
								{ label: t("birth-date"), value: "startDateWritten" },
								{ label: t("birth-place"), value: "placeOfBirth" },
								{ label: t("death-date"), value: "endDateWritten" },
								{ label: t("death-place"), value: "placeOfDeath" },
								{ label: t("status"), value: "status" },
							]}
							data={data}
							fileName={slugify(data.name)}
							jsonLabel={t("download-json")}
							jsonShortLabel={t("file-json")}
							label={t("download")}
							xlsxLabel={t("download-xlsx")}
							xlsxShortLabel={t("file-xlsx")}
						/>
					</div>
				</div>

				<div className="grid content-start gap-x-8 gap-y-12 lg:grid-cols-2">
					<section className="row-span-2 grid content-start gap-y-3">
						<h2 className="text-2xl text-brand-600">{t("section-data")}</h2>

						<dl className="mb-6 grid grid-cols-[auto_auto] justify-start gap-x-8 gap-y-2">
							<dt className="text-neutral-600">{t("first-name")}:</dt>
							<dd>{data.firstName}</dd>

							<dt className="text-neutral-600">{t("name")}:</dt>
							<dd>{data.name}</dd>

							{isNonEmptyArray(data.marriedNames) ? (
								<Fragment>
									<dt className="text-neutral-600">{t("married-names")}:</dt>
									<dd>
										{format.list(
											data.marriedNames.map((item) => {
												return item.relationType;
											}),
										)}
									</dd>
								</Fragment>
							) : null}

							<dt className="text-neutral-600">{t("birth")}:</dt>
							<dd>
								{data.startDateWritten}{" "}
								{data.placeOfBirth?.name
									? t.rich("in-place", {
											// eslint-disable-next-line react/no-unstable-nested-components
											place() {
												if (!data.placeOfBirth) return null;
												const href = `/places/${String(data.placeOfBirth.id)}`;
												return (
													<Link className="underline hover:no-underline" href={href}>
														{data.placeOfBirth.name}
													</Link>
												);
											},
										})
									: null}
							</dd>

							<dt className="text-neutral-600">{t("death")}:</dt>
							<dd>
								{data.endDateWritten}{" "}
								{data.placeOfDeath?.name
									? t.rich("in-place", {
											// eslint-disable-next-line react/no-unstable-nested-components
											place() {
												if (!data.placeOfDeath) return null;
												const href = `/places/${String(data.placeOfDeath.id)}`;
												return (
													<Link className="underline hover:no-underline" href={href}>
														{data.placeOfDeath.name}
													</Link>
												);
											},
										})
									: null}
							</dd>

							{/* FIXME: waiting on @see https://github.com/acdh-oeaw/viecpro-nuxt/issues/113 */}
							{/* <dt className="text-neutral-600">{t("death-cause")}:</dt>
							<dd>{data.cause_of_death}</dd> */}

							<dt className="text-neutral-600">{t("gender")}:</dt>
							<dd>{data.gender}</dd>

							{isNonEmptyArray(data.confession) ? (
								<Fragment>
									<dt className="text-neutral-600">{t("confession")}:</dt>
									<dd>{format.list(data.confession)}</dd>
								</Fragment>
							) : null}
						</dl>

						<Collapsible isDisabled={!isNonEmptyArray(data.duplicates)} label={t("duplicates")}>
							<div className="w-full overflow-x-auto">
								<table className="min-w-full text-brand-950 text-sm">
									<thead>
										<tr className="border-b border-brand-100">
											<th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-brand-600">
												{t("name")}
											</th>
											<th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-brand-600">
												{t("birth-date")}
											</th>
											<th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-brand-600">
												{t("death-date")}
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-neutral-200">
										{data.duplicates?.map((row, index) => {
											return (
												<tr key={index} className="relative">
													<td className="px-3 py-2.5 whitespace-nowrap">
														<Link
															className="after:absolute after:inset-0 hover:after:bg-brand-600/5"
															href={`/${row.target.kind}s/${String(row.target.id)}`}
														>
															{row.target.name}
														</Link>
													</td>
													<td className="px-3 py-2.5 whitespace-nowrap">{row.startDateWritten}</td>
													<td className="px-3 py-2.5 whitespace-nowrap">{row.endDateWritten}</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						</Collapsible>

						<Collapsible
							isDisabled={
								!isNonEmptyArray(data.alternativeFirstNames) &&
								!isNonEmptyArray(data.alternativeLastNames)
							}
							label={t("alternative-names")}
						>
							<dl className="m-3 grid content-start gap-y-3 text-sm">
								{isNonEmptyArray(data.alternativeFirstNames) ? (
									<div className="grid gap-y-0.5">
										<dt className="text-xs font-bold uppercase tracking-wider text-brand-600">
											{t("alternative-first-names")}
										</dt>
										<dd>{format.list(data.alternativeFirstNames)}</dd>
									</div>
								) : null}

								{isNonEmptyArray(data.alternativeLastNames) ? (
									<div className="grid gap-y-0.5">
										<dt className="text-xs font-bold uppercase tracking-wider text-brand-600">
											{t("alternative-last-names")}
										</dt>
										<dd>{format.list(data.alternativeLastNames)}</dd>
									</div>
								) : null}
							</dl>
						</Collapsible>

						<Collapsible
							isDisabled={!isNonEmptyArray(data.honoraryTitles)}
							label={t("honorary-titles")}
						>
							<div className="w-full overflow-x-auto">
								<table className="min-w-full text-brand-950 text-sm">
									<thead>
										<tr className="border-b border-brand-100">
											<th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-brand-600">
												{t("name")}
											</th>
											<th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-brand-600">
												{t("start-date")}
											</th>
											<th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-brand-600">
												{t("end-date")}
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-neutral-200">
										{data.honoraryTitles?.map((row, index) => {
											return (
												<tr key={index} className="relative">
													<td className="px-3 py-2.5 whitespace-nowrap">{row.relationType}</td>
													<td className="px-3 py-2.5 whitespace-nowrap">{row.startDateWritten}</td>
													<td className="px-3 py-2.5 whitespace-nowrap">{row.endDateWritten}</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						</Collapsible>

						<Collapsible
							isDisabled={!isNonEmptyArray(data.academicTitles)}
							label={t("academic-titles")}
						>
							<div className="w-full overflow-x-auto">
								<table className="min-w-full text-brand-950 text-sm">
									<thead>
										<tr className="border-b border-brand-100">
											<th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-brand-600">
												{t("name")}
											</th>
											<th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-brand-600">
												{t("start-date")}
											</th>
											<th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-brand-600">
												{t("end-date")}
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-neutral-200">
										{data.academicTitles?.map((row, index) => {
											return (
												<tr key={index} className="relative">
													<td className="px-3 py-2.5 whitespace-nowrap">{row.relationType}</td>
													<td className="px-3 py-2.5 whitespace-nowrap">{row.startDateWritten}</td>
													<td className="px-3 py-2.5 whitespace-nowrap">{row.endDateWritten}</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
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
											<h4 className="text-xs font-bold uppercase tracking-wider text-brand-600">
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

					<div className="grid content-start gap-y-12">
						<section className="grid content-start gap-y-3">
							<h2 className="text-2xl text-brand-600">{t("section-court-related")}</h2>

							<Collapsible
								isDisabled={!isNonEmptyArray(data.courtFunctions)}
								label={t("court-functions")}
							>
								<div className="w-full overflow-x-auto">
									<table className="min-w-full text-brand-950 text-sm">
										<thead>
											<tr className="border-b border-brand-100">
												<th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-brand-600">
													{t("function")}
												</th>
												<th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-brand-600">
													{t("court")}
												</th>
												<th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-brand-600">
													{t("start-date")}
												</th>
												<th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-brand-600">
													{t("end-date")}
												</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-neutral-200">
											{data.courtFunctions?.map((row, index) => {
												return (
													<tr key={index} className="relative">
														<td className="px-3 py-2.5 whitespace-nowrap">{row.relationType}</td>
														<td className="px-3 py-2.5 whitespace-nowrap">
															<Link
																className="after:absolute after:inset-0 hover:after:bg-brand-600/5"
																href={`/${row.target.kind}s/${String(row.target.id)}`}
															>
																{row.target.name}
															</Link>
														</td>
														<td className="px-3 py-2.5 whitespace-nowrap">
															{row.startDateWritten}
														</td>
														<td className="px-3 py-2.5 whitespace-nowrap">{row.endDateWritten}</td>
													</tr>
												);
											})}
										</tbody>
									</table>
								</div>
							</Collapsible>

							<Collapsible
								isDisabled={!isNonEmptyArray(data.personRelationsCourt)}
								label={t("person-relations-court")}
							>
								<div className="w-full overflow-x-auto">
									<table className="min-w-full text-brand-950 text-sm">
										<thead>
											<tr className="border-b border-brand-100">
												<th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-brand-600">
													{t("relation-type")}
												</th>
												<th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-brand-600">
													{t("name")}
												</th>
												<th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-brand-600">
													{t("start-date")}
												</th>
												<th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-brand-600">
													{t("end-date")}
												</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-neutral-200">
											{data.personRelationsCourt?.map((row, index) => {
												return (
													<tr key={index} className="relative">
														<td className="px-3 py-2.5 whitespace-nowrap">{row.relationType}</td>
														<td className="px-3 py-2.5 whitespace-nowrap">
															<Link
																className="after:absolute after:inset-0 hover:after:bg-brand-600/5"
																href={`/${row.target.kind}s/${String(row.target.id)}`}
															>
																{row.target.name}
															</Link>
														</td>
														<td className="px-3 py-2.5 whitespace-nowrap">
															{row.startDateWritten}
														</td>
														<td className="px-3 py-2.5 whitespace-nowrap">{row.endDateWritten}</td>
													</tr>
												);
											})}
										</tbody>
									</table>
								</div>
							</Collapsible>

							<Collapsible
								isDisabled={!isNonEmptyArray(data.otherRelationsCourt)}
								label={t("other-relations-court")}
							>
								<div className="w-full overflow-x-auto">
									<table className="min-w-full text-brand-950 text-sm">
										<thead>
											<tr className="border-b border-brand-100">
												<th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-brand-600">
													{t("name")}
												</th>
												<th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-brand-600">
													{t("start-date")}
												</th>
												<th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-brand-600">
													{t("end-date")}
												</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-neutral-200">
											{data.otherRelationsCourt?.map((row, index) => {
												return (
													<tr key={index} className="relative">
														<td className="px-3 py-2.5 whitespace-nowrap">{row.relationType}</td>
														<td className="px-3 py-2.5 whitespace-nowrap">
															{row.startDateWritten}
														</td>
														<td className="px-3 py-2.5 whitespace-nowrap">{row.endDateWritten}</td>
													</tr>
												);
											})}
										</tbody>
									</table>
								</div>
							</Collapsible>

							<Collapsible isDisabled={!isNonEmptyArray(data.allowance)} label={t("allowance")}>
								<ul className="m-3 grid content-start gap-y-1" role="list">
									{data.allowance?.map((allowance, index) => {
										return <li key={index}>{allowance}</li>;
									})}
								</ul>
							</Collapsible>
						</section>

						<section className="grid content-start gap-y-3">
							<h2 className="text-2xl text-brand-600">{t("section-additional-info")}</h2>

							<Collapsible
								isDisabled={!isNonEmptyArray(data.relatedPlaces)}
								label={t("related-places")}
							>
								<div className="w-full overflow-x-auto">
									<table className="min-w-full text-brand-950 text-sm">
										<thead>
											<tr className="border-b border-brand-100">
												<th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-brand-600">
													{t("relation")}
												</th>
												<th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-brand-600">
													{t("name")}
												</th>
												<th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-brand-600">
													{t("start-date")}
												</th>
												<th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-brand-600">
													{t("end-date")}
												</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-neutral-200">
											{data.relatedPlaces?.map((row, index) => {
												return (
													<tr key={index} className="relative">
														<td className="px-3 py-2.5 whitespace-nowrap">{row.relationType}</td>
														<td className="px-3 py-2.5 whitespace-nowrap">
															<Link
																className="after:absolute after:inset-0 hover:after:bg-brand-600/5"
																href={`/${row.target.kind}s/${String(row.target.id)}`}
															>
																{row.target.name}
															</Link>
														</td>
														<td className="px-3 py-2.5 whitespace-nowrap">
															{row.startDateWritten}
														</td>
														<td className="px-3 py-2.5 whitespace-nowrap">{row.endDateWritten}</td>
													</tr>
												);
											})}
										</tbody>
									</table>
								</div>
							</Collapsible>

							<Collapsible
								isDisabled={!isNonEmptyArray(data.marriagesAndFamilyRelations)}
								label={t("marriages-and-family-relations")}
							>
								<div className="w-full overflow-x-auto">
									<table className="min-w-full text-brand-950 text-sm">
										<thead>
											<tr className="border-b border-brand-100">
												<th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-brand-600">
													{t("relation-type")}
												</th>
												<th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-brand-600">
													{t("name")}
												</th>
												<th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-brand-600">
													{t("start-date")}
												</th>
												<th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-brand-600">
													{t("end-date")}
												</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-neutral-200">
											{data.marriagesAndFamilyRelations?.map((row, index) => {
												return (
													<tr key={index} className="relative">
														<td className="px-3 py-2.5 whitespace-nowrap">{row.relationType}</td>
														<td className="px-3 py-2.5 whitespace-nowrap">
															<Link
																className="after:absolute after:inset-0 hover:after:bg-brand-600/5"
																href={`/${row.target.kind}s/${String(row.target.id)}`}
															>
																{row.target.name}
															</Link>
														</td>
														<td className="px-3 py-2.5 whitespace-nowrap">
															{row.startDateWritten}
														</td>
														<td className="px-3 py-2.5 whitespace-nowrap">{row.endDateWritten}</td>
													</tr>
												);
											})}
										</tbody>
									</table>
								</div>
							</Collapsible>

							<Collapsible
								isDisabled={!isNonEmptyArray(data.relationsToChurchAndOrders)}
								label={t("relations-to-church-and-orders")}
							>
								<div className="w-full overflow-x-auto">
									<table className="min-w-full text-brand-950 text-sm">
										<thead>
											<tr className="border-b border-brand-100">
												<th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-brand-600">
													{t("relation-type")}
												</th>
												<th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-brand-600">
													{t("start-date")}
												</th>
												<th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-brand-600">
													{t("end-date")}
												</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-neutral-200">
											{data.relationsToChurchAndOrders?.map((row, index) => {
												return (
													<tr key={index} className="relative">
														<td className="px-3 py-2.5 whitespace-nowrap">{row.relationType}</td>
														<td className="px-3 py-2.5 whitespace-nowrap">
															{row.startDateWritten}
														</td>
														<td className="px-3 py-2.5 whitespace-nowrap">{row.endDateWritten}</td>
													</tr>
												);
											})}
										</tbody>
									</table>
								</div>
							</Collapsible>

							<Collapsible
								isDisabled={!isNonEmptyArray(data.nonCourtFunctions)}
								label={t("non-court-functions")}
							>
								<div className="w-full overflow-x-auto">
									<table className="min-w-full text-brand-950 text-sm">
										<thead>
											<tr className="border-b border-brand-100">
												<th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-brand-600">
													{t("relation-type")}
												</th>
												<th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-brand-600">
													{t("start-date")}
												</th>
												<th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-brand-600">
													{t("end-date")}
												</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-neutral-200">
											{data.nonCourtFunctions?.map((row, index) => {
												return (
													<tr key={index} className="relative">
														<td className="px-3 py-2.5 whitespace-nowrap">{row.relationType}</td>
														<td className="px-3 py-2.5 whitespace-nowrap">
															{row.startDateWritten}
														</td>
														<td className="px-3 py-2.5 whitespace-nowrap">{row.endDateWritten}</td>
													</tr>
												);
											})}
										</tbody>
									</table>
								</div>
							</Collapsible>
						</section>
					</div>
				</div>
			</div>
		</MainContent>
	);
}
