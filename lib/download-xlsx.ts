import download, { type IJsonSheet } from "json-as-xlsx";

export function downloadXlsx(sheets: Array<IJsonSheet>, fileName: string) {
	download(sheets, { fileName });
}
