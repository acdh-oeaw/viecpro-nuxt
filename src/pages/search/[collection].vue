<script lang="ts" setup>
import { history } from "instantsearch.js/es/lib/routers";
import { simple } from "instantsearch.js/es/lib/stateMappings";
import {
	AisConfigure,
	AisHits,
	AisInstantSearch,
	AisPagination,
	AisSearchBox,
} from "vue-instantsearch/vue3/es";

import { isCollection } from "@/utils/search/is-collection";
import { useCollection } from "@/utils/search/use-collection";
import { usePrefixedCollection } from "@/utils/search/use-prefixed-collection";
import { useSearchClient } from "@/utils/search/use-search-client";

definePageMeta({
	title: "SearchPage.meta.title",
	validate(route) {
		return isCollection(route.params.collection);
	},
});

const _locale = useLocale();
const t = useTranslations("SearchPage");

const collection = useCollection();
const indexName = computed(() => usePrefixedCollection(collection.value));
const searchClient = useSearchClient();

// TODO: https://www.algolia.com/doc/guides/building-search-ui/going-further/routing-urls/vue/#rewriting-urls-manually
// TODO: https://www.algolia.com/doc/guides/building-search-ui/going-further/routing-urls/vue/#combining-with-nuxtjs
const routing = {
	router: history(),
	stateMapping: simple(),
};
</script>

<template>
	<MainContent>
		<div class="container grid content-start gap-12 py-16">
			<h1>{{ t("title") }}</h1>

			<div>
				<AisInstantSearch :index-name="indexName" :routing="routing" :search-client="searchClient">
					<AisConfigure :hits-per-page.camel="25" />

					<CollectionSelect />

					<AisSearchBox
						autofocus
						:placeholder="t('search')"
						:reset-title="t('reset')"
						show-loading-indicator
						:submit-title="t('submit')"
					/>

					<AisHits>
						<template #default="{ items }">
							<ul role="list">
								<li v-for="item of items" :key="item.id">
									<article>
										<pre>{{ item }}</pre>
									</article>
								</li>
							</ul>
						</template>
					</AisHits>

					<nav :aria-label="t('navigation-pagination')">
						<AisPagination />
					</nav>
				</AisInstantSearch>
			</div>
		</div>
	</MainContent>
</template>
