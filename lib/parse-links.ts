const regex = /https?:\/\/[\w./%?=&]+/g;

/**
 * Parse links into html anchor elements, handling any trailing punctuation marks.
 */
export function parseLinks(input: string): string {
	return input.replace(regex, (url: string) => {
		return `<a class="underline hover:no-underline" href="${url}">${url}</a>`;
	});
}
