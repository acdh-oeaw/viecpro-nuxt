import type { ValueForReading } from "@keystatic/core";

import type { createLinkSchema } from "@/lib/keystatic/create-link-schema";

export type LinkSchema = ValueForReading<ReturnType<typeof createLinkSchema>>;

export function getLinkProps(params: LinkSchema) {
	switch (params.discriminant) {
		case "documentation": {
			return { href: `/documentation/${params.value}` };
		}

		case "download": {
			return { download: true, href: params.value };
		}

		case "external": {
			return { href: params.value };
		}
	}
}
