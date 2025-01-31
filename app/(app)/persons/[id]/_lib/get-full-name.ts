import { isNonEmptyString } from "@acdh-oeaw/lib";

export function getFullName(person: { firstName?: string; name: string }): string {
	return [person.name, person.firstName].filter(isNonEmptyString).join(", ");
}
