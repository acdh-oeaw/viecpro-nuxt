<script lang="ts" setup>
import "@/styles/search.css";

import { history } from "instantsearch.js/es/lib/routers";
import { simple } from "instantsearch.js/es/lib/stateMappings";
import { computed } from "vue";
import {
	AisConfigure,
	AisHits,
	AisInstantSearch,
	AisPagination,
	AisSearchBox,
} from "vue-instantsearch/vue3/es";

import MainContent from "@/components/main-content.vue";
import PageTitle from "@/components/page-title.vue";
import CollectionSelect from "@/components/search/collection-select.vue";
import { useI18n } from "@/lib/i18n/use-i18n";
import { createSearchClient } from "@/lib/search/create-search-client";
import { getPrefixedCollection } from "@/lib/search/get-prefixed-collection";
import { isCollection } from "@/lib/search/is-collection";
import { useCollection } from "@/lib/search/use-collection";
import { definePageMeta } from "#imports";

definePageMeta({
	title: "pages.search.title",
	validate(route) {
		return isCollection(route.params.collection);
	},
});

const { t } = useI18n();

const selectedCollection = useCollection();

const searchClient = createSearchClient();

const indexName = computed(() => {
	return getPrefixedCollection(selectedCollection.value);
});

// TODO: https://www.algolia.com/doc/guides/building-search-ui/going-further/routing-urls/vue/#rewriting-urls-manually
// TODO: https://www.algolia.com/doc/guides/building-search-ui/going-further/routing-urls/vue/#combining-with-nuxtjs
const routing = {
	router: history(),
	stateMapping: simple(),
};
</script>

<template>
	<MainContent>
		<div class="mx-auto w-full max-w-container px-4 py-2">
			<PageTitle>{{ t("pages.search.title") }}</PageTitle>

			<AisInstantSearch :index-name="indexName" :routing="routing" :search-client="searchClient">
				<AisConfigure :hits-per-page.camel="25" />

				<CollectionSelect />

				<AisSearchBox
					autofocus
					:placeholder="t('common.search')"
					:reset-title="t('common.reset')"
					show-loading-indicator
					:submit-title="t('common.submit')"
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

				<nav :aria-label="t('common.pagination')">
					<AisPagination />
				</nav>
			</AisInstantSearch>
		</div>
	</MainContent>
</template>
