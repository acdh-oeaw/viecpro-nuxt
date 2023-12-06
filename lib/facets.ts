import { useRoute } from "vue-router";

type FacetObject = Record<string, Array<string>>;

export const facetObjectToTypesenseQuery = (facetObject: FacetObject, encode = false): string => {
	const retArray: Array<string> = [];
	Object.entries(facetObject).forEach(([key, value]) => {
		if (value.length !== 0) {
			retArray.push(key + ":=[`" + value.join("`,`") + "`]");
		}
	});
	const query: string = retArray.join("&&");

	return encode ? encodeURIComponent(query).replace("=", "") : query;
};

export const typesenseQueryToFacetObject = (
	typeQuery: string,
	decode = false,
): Record<string, Array<string>> => {
	const query: string = decode ? decodeURIComponent(typeQuery) : typeQuery;
	const facetArray: Array<string> = query.split("&&");
	const retObject: FacetObject = {};
	facetArray.forEach((facetString: string) => {
		const [key, value] = facetString.split(":=");
		if (key !== undefined) {
			retObject[key] = JSON.parse(String(value).replaceAll("`", '"')) as Array<string>;
		}
	});
	return retObject;
};

export const getFacetObjectFromURL = (decode = false): Record<string, Array<string>> => {
	const query = useRoute().query;
	if (query.facets === undefined) return {};
	return typesenseQueryToFacetObject(String(query.facets), decode);
};
