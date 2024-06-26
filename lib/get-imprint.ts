export async function getImprint(locale: string) {
	const data = await fetch(
		"https://imprint.acdh.oeaw.ac.at/21622?format=markdown&locale=" + locale,
	);
	return data;
}
