import type { useRouter } from "#/lib/i18n/navigation.ts";

declare module "react-aria-components" {
	interface RouterConfig {
		routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>["push"]>[1]>;
	}
}
