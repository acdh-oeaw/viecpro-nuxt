<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { Loader2 } from "lucide-vue-next";

import { getImprint } from "@/lib/get-imprint";

const { locale } = useI18n();
const imprintQuery = ref();

imprintQuery.value = useQuery({
	queryKey: ["imprint", locale.value] as const,
	queryFn: async ({ queryKey }) => {
		const [, locale] = queryKey;
		const ret = await (await getImprint(locale)).text();
		return ret;
	},
});

definePageMeta({
	title: "pages.imprint.title",
});
</script>

<template>
	<MainContent class="mx-auto w-full max-w-container">
		<div v-if="!imprintQuery.isFetching">
			<p id="imprint" v-html="imprintQuery.data" />
		</div>
		<Centered v-else><Loader2 class="h-8 w-8 animate-spin" /></Centered>
	</MainContent>
</template>

<style>
#imprint {
	h2 {
		@apply text-2xl my-3 font-semibold;
	}

	h3 {
		@apply text-lg my-4 font-semibold;
	}

	p {
		@apply my-4;
	}

	a {
		@apply underline;
	}
}
</style>
