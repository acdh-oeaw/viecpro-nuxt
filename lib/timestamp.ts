export function convertYearToTimestamp(year: number): number {
	return (
		new Date(Date.UTC(year, 0, 1))
			/** `Date.UTC` treats years between 0 and 99 as 20th century dates. */
			.setUTCFullYear(year) / 1000
	);
}
