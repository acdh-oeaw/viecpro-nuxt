import { createUrl, isNonEmptyArray, isNonEmptyString } from "@acdh-oeaw/lib";
import { InfoIcon, UsersIcon } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";
import { getFormatter, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Fragment, type ReactNode } from "react";

import { getFunction } from "#/app/(app)/functions/[id]/_lib/data.ts";
import { Link } from "#/components/link.tsx";
import { MainContent } from "#/components/main-content.tsx";
import { PopoverNote } from "#/components/popover-note.tsx";
import { env } from "#/config/env.config.ts";
import { createHref } from "#/lib/create-href.ts";

interface FunctionPageProps {
	params: Promise<{
		id: string;
	}>;
}

async function getData(params: FunctionPageProps["params"]) {
	const { id: _id } = await params;
	const id = decodeURIComponent(_id);

	if (Number.isNaN(Number(id))) {
		notFound();
	}

	const data = await getFunction(id);

	if (data == null) {
		notFound();
	}

	return data;
}

export async function generateMetadata(
	props: Readonly<FunctionPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const data = await getData(props.params);

	const metadata: Metadata = {
		title: data.name,
		description: data.definition,
	};

	return metadata;
}

function isUrl(value: string): boolean {
	return /^https?:\/\//.test(value);
}

export default async function FunctionPage(props: Readonly<FunctionPageProps>): Promise<ReactNode> {
	const t = await getTranslations("FunctionPage");
	const format = await getFormatter();

	const data = await getData(props.params);

	const href = String(
		createUrl({
			baseUrl: env.NEXT_PUBLIC_APP_BASE_URL,
			pathname: `/functions/${data.id}`,
		}),
	);

	const personsHref = createHref({
		pathname: "/search/persons",
		searchParams: {
			functions: data.terms.map((term) => {
				return term.name;
			}),
		},
	});

	return (
		<MainContent className="flex flex-col">
			<div className="mx-auto grid w-full max-w-7xl content-start gap-y-12 px-4 pt-8 pb-16 xs:gap-y-16 xs:px-8">
				<div className="grid content-start gap-y-4">
					<div>
						<span className="text-xs font-bold tracking-wider text-brand-600 uppercase">
							{t("function")}
						</span>
						<h1 className="text-4xl font-bold tracking-tight text-brand-600">{data.name}</h1>
						{isNonEmptyString(data.fieldOfActivity) ? (
							<p className="mt-1 text-neutral-600">{data.fieldOfActivity}</p>
						) : null}
					</div>

					<div className="order-1 flex flex-wrap items-center justify-end gap-x-3 gap-y-2">
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
									{t("register")} - {t("function")}
								</div>
								<div>{data.name}</div>
								{/* eslint-disable-next-line react/jsx-no-literals */}
								<div>VieCPro-ID: {data.id}</div>
								<div>
									{"URI: "}
									<a className="underline hover:no-underline" href={href}>
										{href}
									</a>
								</div>
							</div>
						</PopoverNote>
					</div>
				</div>

				<div className="grid content-start gap-x-8 gap-y-12 lg:grid-cols-2">
					<section className="grid content-start gap-y-3">
						<h2 className="text-2xl text-brand-600">{t("section-definition")}</h2>

						<dl className="grid grid-cols-[auto_1fr] justify-start gap-x-8 gap-y-2">
							<dt className="text-neutral-600">{t("field-of-activity")}:</dt>
							<dd>{data.fieldOfActivity}</dd>

							<dt className="text-neutral-600">{t("definition")}:</dt>
							<dd className="whitespace-pre-line">
								{isNonEmptyString(data.definition) ? (
									data.definition.trim()
								) : (
									<span className="text-neutral-500 italic">{t("no-definition")}</span>
								)}
							</dd>

							{isNonEmptyString(data.source) ? (
								<Fragment>
									<dt className="text-neutral-600">{t("source")}:</dt>
									<dd className="wrap-break-word">
										{isUrl(data.source) ? (
											<a className="underline hover:no-underline" href={data.source}>
												{data.source}
											</a>
										) : (
											data.source
										)}
									</dd>
								</Fragment>
							) : null}
						</dl>
					</section>

					<section className="grid content-start gap-y-3">
						<div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
							<h2 className="text-2xl text-brand-600">
								{t("section-terms", { count: data.terms.length })}
							</h2>
							{data.personCount > 0 ? (
								<Link
									className="inline-flex items-center gap-x-1.5 text-sm text-brand-600 underline-offset-2 hover:underline"
									href={personsHref}
								>
									<UsersIcon aria-hidden={true} className="size-4 shrink-0" />
									{t("show-all-persons", { count: data.personCount })}
								</Link>
							) : null}
						</div>

						<div className="overflow-x-auto">
							<table className="min-w-full text-sm">
								<thead>
									<tr className="border-b border-brand-100 text-left text-xs font-bold tracking-wider text-brand-600 uppercase">
										<th className="px-4 py-3">{t("term")}</th>
										<th className="px-4 py-3">{t("synonyms")}</th>
										<th className="px-4 py-3 text-right">{t("persons")}</th>
									</tr>
								</thead>
								<tbody>
									{data.terms.map((term) => {
										return (
											<tr key={term.id} className="align-top odd:bg-brand-50">
												<td className="px-4 py-2.5">{term.name}</td>
												<td className="px-4 py-2.5 text-neutral-600">
													{isNonEmptyArray(term.synonyms) ? format.list(term.synonyms) : null}
												</td>
												<td className="px-4 py-2.5 text-right tabular-nums">
													{term.personCount > 0 ? (
														<Link
															className="text-brand-600 underline underline-offset-2 hover:no-underline"
															href={createHref({
																pathname: "/search/persons",
																searchParams: { functions: term.name },
															})}
															aria-label={t("show-persons", {
																count: term.personCount,
																name: term.name,
															})}
														>
															{format.number(term.personCount)}
														</Link>
													) : (
														<span className="text-neutral-500">{format.number(0)}</span>
													)}
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</section>
				</div>
			</div>
		</MainContent>
	);
}
