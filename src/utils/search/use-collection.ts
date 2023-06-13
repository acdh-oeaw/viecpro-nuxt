import { assert } from "@acdh-oeaw/lib";
import { computed, type ComputedRef } from "vue";

import { type Collection } from "@/utils/search/collections.config";
import { isCollection } from "@/utils/search/is-collection";
import { useRoute } from "#imports";

export function useCollection(): ComputedRef<Collection> {
	const route = useRoute();

	const collection = computed(() => {
		const collection = route.params.collection;

		assert(isCollection(collection));

		return collection;
	});

	return collection;
}
