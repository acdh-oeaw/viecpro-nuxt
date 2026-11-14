import type { LinkProps } from "#/components/link.tsx";
import { env } from "#/config/env.config.ts";
import { createFullUrl } from "#/lib/create-full-url.ts";
import { usePathname } from "#/lib/i18n/navigation.ts";

interface UseNavLinkParams extends Pick<LinkProps, "aria-current" | "href"> {}

interface UseNavLinkReturnValue extends Pick<LinkProps, "aria-current"> {}

export function useNavLink(params: UseNavLinkParams): UseNavLinkReturnValue {
	const { "aria-current": ariaCurrent, href } = params;

	const pathname = usePathname();

	if (ariaCurrent != null) {
		return {
			"aria-current": ariaCurrent,
		};
	}

	const isCurrent = isCurrentPage(href, pathname);

	return {
		"aria-current": isCurrent ? "page" : undefined,
	};
}

export function isCurrentPage(href: string | undefined, pathname: string): boolean {
	const url = createFullUrl({ pathname: href });
	const isCurrent = url.origin === env.NEXT_PUBLIC_APP_BASE_URL && url.pathname === pathname;
	return isCurrent;
}
