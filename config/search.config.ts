import { convertYearToTimestamp } from "#/lib/timestamp.ts";

export const limit = 25;
export const maxFacetValues = 250;

export const minDate = 1550;
export const maxDate = 1950;
/**
 * Magic constant to represent empty dates (defined by typesense ingest script).
 */
export const emptyDate = convertYearToTimestamp(5000);

export const defaultFacets = 10;
export const maxFacets = 25;

export const perPageDownloadLimit = 250;
/**
 * Max number of search requests in a single typesense multi-search (`limit_multi_searches`).
 */
export const maxDownloadPages = 50;

export function isDownloadUnsupported(count: number): boolean {
	return Math.ceil(count / perPageDownloadLimit) > maxDownloadPages;
}
