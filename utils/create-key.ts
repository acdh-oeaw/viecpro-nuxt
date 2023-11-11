export function createKey(...segments: Array<MaybeRef<string>>): string {
	return segments.map(unref).join("-");
}
