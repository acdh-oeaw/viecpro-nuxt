import { useRoute } from "vue-router";

type FacetObject = Record<string, Array<string> | [number, number]>;

export const facetObjectToTypesenseQuery = (facetObject: FacetObject, encode = false): string => {
	const retArray: Array<string> = [];
	Object.entries(facetObject).forEach(([key, value]) => {
		if (value.length !== 0) {
			if (key === "start_date_int") {
				retArray.push(`${key}:[${value[0]}..${value[1]},0]`);
			} else if (key === "end_date_int") {
				retArray.push(`${key}:[${value[0]}..${value[1]},5000]`);
			} else {
				retArray.push(key + ":=[`" + value.join("`,`") + "`]");
			}
		}
	});
	const query: string = retArray.join("&&");

	return encode ? encodeURIComponent(query).replace("=", "") : query;
};

export const typesenseQueryToFacetObject = (
	typeQuery: string,
	decode = false,
): Record<string, Array<string> | [number, number]> => {
	const query: string = decode ? decodeURIComponent(typeQuery) : typeQuery;
	const facetArray: Array<string> = query.split("&&");
	const retObject: FacetObject = {};
	facetArray.forEach((facetString: string) => {
		if (facetString.includes(":=")) {
			const [key, value] = facetString.split(":=");
			if (key !== undefined && value !== undefined) {
				retObject[key] = JSON.parse(String(value).replaceAll("`", '"')) as Array<string>;
			}
		} else {
			const [key, value] = facetString.split(":");
			if (key !== undefined && value !== undefined) {
				retObject[key] = value.replace(/\[(\d*)\.\.(\d*),\d*\]/, "$1;$2").split(";"); // converts format [yyyy..yyyy,y] to classic [yyyy,yyyy]
			}
		}
	});
	return retObject;
};

export const getFacetObjectFromURL = (decode = false): Record<string, Array<string>> => {
	const query = useRoute().query;
	if (query.facets === undefined) return {};
	return typesenseQueryToFacetObject(String(query.facets), decode);
};
