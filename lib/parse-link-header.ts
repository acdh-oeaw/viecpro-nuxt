export function parseLinkHeader(header: string | null): Record<string, string> {
	const links: Record<string, string> = {};

	if (header == null) {
		return links;
	}

	const parts = header.split(",");

	parts.forEach((part) => {
		const section = part.split(";");
		if (section.length < 2) return;

		const url = section[0]!.trim().slice(1, -1);

		const relMatch = /rel="(.+)"/.exec(section[1]!.trim());
		if (relMatch) {
			const rel = relMatch[1]!;
			links[rel] = url;
		}
	});

	return links;
}
