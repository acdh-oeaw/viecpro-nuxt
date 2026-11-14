export type ContentLink =
	| { discriminant: "documentation"; value: string }
	| { discriminant: "download"; value: string }
	| { discriminant: "external"; value: string };

export function getLinkProps(link: ContentLink) {
	switch (link.discriminant) {
		case "documentation": {
			return { href: `/documentation/${link.value}` };
		}
		case "download": {
			return { download: true, href: link.value };
		}
		case "external": {
			return { href: link.value };
		}
	}
}
