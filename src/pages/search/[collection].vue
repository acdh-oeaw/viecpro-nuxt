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
import SingleSelect from "@/components/single-select.vue";
import { useI18n } from "@/lib/i18n/use-i18n";
import { type Collection, collections } from "@/lib/search/collections.config";
import { createSearchClient } from "@/lib/search/create-search-client";
import { getPrefixedCollection } from "@/lib/search/get-prefixed-collection";
import { definePageMeta, useRoute, useRouter } from "#imports";

definePageMeta({
	title: "pages.search.title",
	validate(route) {
		return Object.keys(collections).includes(route.params.collection as string);
	},
});

const { t } = useI18n();

const router = useRouter();
const route = useRoute();

const selectedCollection = computed(() => {
	return route.params.collection as Collection;
});

function onChangeSelectedCollection(collection: string) {
	router.push({ path: `/search/${collection as Collection}` });
}

const items = computed(() => {
	return Object.keys(collections).map((id) => {
		return { id, label: t(`collections.${id}`, 10) };
	});
});

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

				<SingleSelect
					:items="items"
					:label="t('common.collection')"
					:selected-key="selectedCollection"
					@change-selection="onChangeSelectedCollection"
				/>

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
