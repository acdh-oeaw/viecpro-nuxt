"use client";

import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { I18nProvider, RouterProvider } from "react-aria-components";

import type { IntlMessages, Locale } from "@/config/i18n.config";
import { useRouter } from "@/lib/i18n/navigation";

interface ProvidersProps {
	children: ReactNode;
	locale: Locale;
	messages: Partial<IntlMessages>;
}

export function Providers(props: Readonly<ProvidersProps>): ReactNode {
	const { children, locale, messages } = props;

	const router = useRouter();

	return (
		// eslint-disable-next-line @typescript-eslint/unbound-method
		<RouterProvider navigate={router.push}>
			<NextIntlClientProvider locale={locale} messages={messages}>
				<I18nProvider locale={locale}>{children}</I18nProvider>
			</NextIntlClientProvider>
		</RouterProvider>
	);
}
