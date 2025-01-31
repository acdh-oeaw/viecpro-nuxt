const isoDateFormat = new Intl.DateTimeFormat("en-ca");

export function isodate(date: Date): string {
	return isoDateFormat.format(date);
}
