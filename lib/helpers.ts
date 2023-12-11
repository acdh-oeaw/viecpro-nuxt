export function removeDuplicates(arr: Array<object>, id: Array<string> | string) {
	let ids: Array<string>;
	switch (typeof id) {
		case "number":
			ids = [String(id)];
			break;
		case "string":
			ids = [id];
			break;
		default:
			ids = id;
			break;
	}
	return arr.filter(
		(x: Record<string, string>, i, self) =>
			i ===
			self.findIndex((t: Record<string, string>) => {
				const uneq: boolean = (key: string) => t[key] !== x[key];
				return !ids.some(uneq);
			}),
	);
}
