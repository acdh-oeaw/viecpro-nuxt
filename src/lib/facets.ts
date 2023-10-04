import { useRoute } from "vue-router";

export const facetObjectToTypesenseQuery = (facetObject: object, encode = false): string => {
	const retArray: Array<string> = [];
	Object.entries(facetObject).forEach(([key, value]) => {
		if (value !== undefined && value.length !== 0) {
			retArray.push(key + ":=[`" + value.join("`,`") + "`]");
		}
	});
	const query: string = retArray.join("&&");

	return encode ? encodeURIComponent(query).replace("=", "") : query;
};

export const typesenseQueryToFacetObject = (typeQuery: string, decode = false): object => {
	const query: string = decode ? decodeURIComponent(typeQuery) : typeQuery;
	const facetArray: Array<string> = query.split("&&");
	const retObject: {
		[key: string]: string;
	} = {};
	facetArray.forEach((facetString: string) => {
		const [key, value] = facetString.split(":=");
		if (key !== undefined) {
			retObject[key] = JSON.parse(String(value).replaceAll("`", '"'));
		}
	});
	return retObject;
};

export const getFacetObjectFromURL = (decode = false): object => {
	const query = useRoute().query;
	if (query.facets_query === undefined) return {};
	return typesenseQueryToFacetObject(String(useRoute().query.facets_query), decode);
};
