const regex = /(https?:\/\/[^\s.,!?;:()]+)([.,!?;:()])?/g;

/**
 * Parse links into html anchor elements, handling any trailing punctuation marks.
 */
export function parseLinks(input: string): string {
	return input.replace(regex, (match, url: string, punctuation: string) => {
		return `<a href="${url}">${url}</a>${punctuation || ""}`;
	});
}
