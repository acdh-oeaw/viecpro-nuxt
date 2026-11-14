import { env } from "#/config/env.config.ts";

/**
 * Use `{slug}` as a placeholder for the current entry's id.
 */
export function createPreviewUrl(previewUrl: string): string {
	if (env.NEXT_PUBLIC_KEYSTATIC_MODE === "github") {
		return `/api/preview/start?branch={branch}&to=${previewUrl}`;
	}

	return previewUrl;
}
