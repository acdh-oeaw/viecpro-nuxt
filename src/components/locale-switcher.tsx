import { Link, useLocale, useTranslations } from "next-intl";

export function LocaleSwitcher(): JSX.Element {
	const locale = useLocale();
	const t = useTranslations("LocaleSwitcher");

	const otherLocale = locale === "en" ? "de" : "en";

	return (
		<Link href={{ pathname: "/" }} locale={otherLocale}>
			{t("switch-locale", { locale: otherLocale })}
		</Link>
	);
}
