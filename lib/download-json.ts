export function downloadJson(data: object, fileName: string) {
	const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
	const objectUrl = URL.createObjectURL(blob);

	const anchor = document.createElement("a");
	anchor.setAttribute("download", fileName);
	anchor.setAttribute("href", objectUrl);
	anchor.click();

	anchor.remove();
	URL.revokeObjectURL(objectUrl);
}
