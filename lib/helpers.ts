export function downloadAsJson(content: object, title: string) {
	const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(content));
	const downloadAnchorNode = document.createElement("a");
	downloadAnchorNode.setAttribute("href", dataStr);
	downloadAnchorNode.setAttribute("download", title + ".json");
	document.body.appendChild(downloadAnchorNode); // required for firefox
	downloadAnchorNode.click();
	downloadAnchorNode.remove();
}

export function detectURLsAddLinks(content: string) {
	const urlRegex =
		/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
	return content.replace(
		urlRegex,
		'<a style="text-decoration: underline; font-weight: 600;" href="$1" target="_blank">$1&#8599;</a>',
	);
}
