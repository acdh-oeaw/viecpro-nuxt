<script lang="ts" setup>
import { computed } from "vue";

import SingleSelect from "@/components/single-select.vue";
import { useI18n } from "@/lib/i18n/use-i18n";
import { type Collection, collections } from "@/lib/search/collections.config";
import { useRoute, useRouter } from "#imports";

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
</script>

<template>
	<SingleSelect
		:items="items"
		:label="t('common.collection')"
		:selected-key="selectedCollection"
		@change-selection="onChangeSelectedCollection"
	/>
</template>
