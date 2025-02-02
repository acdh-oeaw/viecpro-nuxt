"use client";

import { cn } from "@acdh-oeaw/style-variants";
import { MenuIcon, XIcon } from "lucide-react";
import { Fragment, type ReactNode } from "react";
import { Button, Dialog, DialogTrigger, Heading, Modal, ModalOverlay } from "react-aria-components";

import { Image } from "@/components/image";
import { NavLink, type NavLinkProps } from "@/components/nav-link";
import { usePathname } from "@/lib/i18n/navigation";
import logo from "@/public/assets/images/logo-viecpro-with-text.png";

interface NavigationLink {
	type: "link";
	href: NonNullable<NavLinkProps["href"]>;
	label: string;
	isCurrent: "exact" | "group";
}

export type NavigationItem = NavigationLink;

interface AppNavigationProps {
	label: string;
	navigation: { home: NavigationLink } & Record<string, NavigationItem>;
}

export function AppNavigation(props: Readonly<AppNavigationProps>): ReactNode {
	const { label, navigation } = props;

	const pathname = usePathname();

	return (
		<nav aria-label={label} className="hidden w-full justify-between md:flex md:gap-x-12">
			<NavLink
				className={cn(
					"-ml-2 grid h-full shrink-0 place-content-center self-center p-2",
					"interactive focus-visible:focus-outline focus-visible:focus-outline-inverse focus-visible:-focus-outline-offset-2",
				)}
				href={navigation.home.href}
			>
				<Image alt="" className="h-10 w-auto shrink-0" src={logo} />
				<span className="sr-only">{navigation.home.label}</span>
			</NavLink>

			<ul className="flex flex-wrap" role="list">
				{Object.entries(navigation).map(([id, item]) => {
					switch (item.type) {
						// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
						case "link": {
							return (
								<li key={id}>
									<NavLink
										aria-current={
											item.isCurrent === "group" && pathname.startsWith(item.href)
												? "page"
												: undefined
										}
										className={cn(
											"relative inline-flex px-4 py-6 text-white transition",
											"interactive focus-visible:focus-outline focus-visible:focus-outline-inverse focus-visible:-focus-outline-offset-2 hover:bg-brand-700 pressed:bg-brand-800",
											"aria-[current]:select-overlay aria-[current]:select-overlay-border-bottom",
										)}
										href={item.href}
									>
										{item.label}
									</NavLink>
								</li>
							);
						}
					}
				})}
			</ul>
		</nav>
	);
}

interface AppNavigationMobileProps {
	label: string;
	menuCloseLabel: string;
	menuOpenLabel: string;
	menuTitleLabel: string;
	navigation: { home: NavigationLink } & Record<string, NavigationItem>;
}

export function AppNavigationMobile(props: Readonly<AppNavigationMobileProps>): ReactNode {
	const { label, menuCloseLabel, menuOpenLabel, menuTitleLabel, navigation } = props;

	const pathname = usePathname();

	return (
		<Fragment>
			<NavLink
				className={cn(
					"md:hidden",
					"-ml-2 grid h-full shrink-0 place-content-center self-center p-2",
					"interactive focus-visible:focus-outline focus-visible:focus-outline-inverse focus-visible:-focus-outline-offset-2",
				)}
				href={navigation.home.href}
			>
				<Image alt="" className="h-10 w-auto shrink-0" src={logo} />
				<span className="sr-only">{navigation.home.label}</span>
			</NavLink>
			<DialogTrigger>
				<nav aria-label={label} className="flex items-center py-3 md:hidden">
					<Button
						className={cn(
							"-mr-3 grid place-content-center rounded-lg p-3 transition",
							"interactive focus-visible:focus-outline focus-visible:focus-outline-offset-0 hover:bg-brand-700 pressed:bg-brand-800",
						)}
					>
						<MenuIcon aria-hidden={true} className="size-6 shrink-0 text-white" />
						<span className="sr-only">{menuOpenLabel}</span>
					</Button>
				</nav>
				<ModalOverlay
					className="fixed left-0 top-0 isolate z-20 grid h-[var(--visual-viewport-height)] w-full justify-items-end bg-brand-950/15"
					isDismissable={true}
				>
					<Modal className="ml-12 size-full max-h-full max-w-xs bg-white shadow-lg animate-in slide-in-from-right fill-mode-both forced-colors:bg-[Canvas]">
						<Dialog className="relative h-full max-h-[inherit] overflow-auto">
							{({ close }) => {
								return (
									<Fragment>
										<header className="flex justify-end p-6">
											<Heading className="sr-only" slot="title">
												{menuTitleLabel}
											</Heading>
											<Button
												className={cn(
													"-my-3 -mr-3 grid place-content-center rounded-lg p-3 transition",
													"interactive focus-visible:focus-outline focus-visible:focus-outline-offset-0 hover:bg-brand-100 pressed:bg-brand-200",
												)}
												slot="close"
											>
												<XIcon aria-hidden={true} className="size-6 shrink-0 text-brand-500" />
												<span className="sr-only">{menuCloseLabel}</span>
											</Button>
										</header>
										<ul className="font-medium" role="list">
											{Object.entries(navigation).map(([id, item]) => {
												switch (item.type) {
													// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
													case "link": {
														return (
															<li key={id}>
																<NavLink
																	aria-current={
																		item.isCurrent === "group" && pathname.startsWith(item.href)
																			? "page"
																			: undefined
																	}
																	className={cn(
																		"inline-flex w-full px-6 py-3 text-brand-600 transition",
																		"interactive focus-visible:focus-outline focus-visible:-focus-outline-offset-2 hover:bg-brand-100 pressed:bg-brand-200",
																		"aria-[current]:bg-brand-100",
																	)}
																	href={item.href}
																	onPress={() => {
																		/**
																		 * `next/link` does not support pointer events, and `click`
																		 * fires after react aria components' `press` events, therefore
																		 * we delay closing the dialog so the navigation is guaranteed to
																		 * be triggered. practically, this seems only relevant for
																		 * firefox on touch devices.
																		 *
																		 * maybe unnecessary after @see https://github.com/adobe/react-spectrum/pull/7542
																		 */
																		requestAnimationFrame(close);
																	}}
																>
																	{item.label}
																</NavLink>
															</li>
														);
													}
												}
											})}
										</ul>
									</Fragment>
								);
							}}
						</Dialog>
					</Modal>
				</ModalOverlay>
			</DialogTrigger>
		</Fragment>
	);
}
