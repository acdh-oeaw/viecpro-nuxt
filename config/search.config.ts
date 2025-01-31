import { convertYearToTimestamp } from "@/lib/timestamp";

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
