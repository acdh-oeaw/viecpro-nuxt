import { isNonEmptyString } from "@acdh-oeaw/lib";

export function createPageTitle(...titles: Array<string | undefined>): string {
	return titles.filter(isNonEmptyString).join(" - ");
}
