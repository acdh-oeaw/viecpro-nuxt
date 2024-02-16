export function downloadAsJson(content: object, title: string) {
	const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(content));
	const downloadAnchorNode = document.createElement("a");
	downloadAnchorNode.setAttribute("href", dataStr);
	downloadAnchorNode.setAttribute("download", title + ".json");
	document.body.appendChild(downloadAnchorNode); // required for firefox
	downloadAnchorNode.click();
	downloadAnchorNode.remove();
}
