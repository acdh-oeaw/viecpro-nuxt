<script lang="ts" setup>
import SingleSelect, { type Option } from "@/components/ui/single-select.vue";
import { type Collection, collections } from "@/utils/search/collections.config";
import { useCollection } from "@/utils/search/use-collection";

const t = useTranslations("CollectionSelect");

const router = useRouter();

const collection = useCollection();

const options = Object.fromEntries(
	Object.keys(collections).map((_id) => {
		const id = _id as Collection;
		return [id, { value: id, label: t(`collections.${id}`) }];
	}),
) as Record<Collection, Option>;

function onSelectionChange(option: Option | null) {
	router.push({ path: `/search/${option?.value ?? "courts"}` });
}
</script>

<template>
	<SingleSelect
		:label="t('select-collection')"
		:placeholder="t('select-collection')"
		:options="Object.values(options)"
		:selected-option="options[collection]"
		@selection-change="onSelectionChange"
	/>
</template>
