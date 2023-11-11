<script lang="ts" setup>
import { ChevronUpIcon } from "lucide-vue-next";
import { useRoute } from "vue-router";

const route = useRoute();

defineProps<{
	page: number;
	limit: number;
	all: number;
}>();

const t = useTranslations();
</script>

<template>
	<div class="flex items-center justify-between">
		<NuxtLink
			v-if="page > 1"
			:to="{
				query: {
					...route.query,
					page: page - 1,
				},
			}"
		>
			<div
				class="cursor-pointer rounded-md border p-2 transition hover:bg-neutral-200 active:bg-neutral-300"
			>
				<ChevronUpIcon class="h-5 w-5 -rotate-90" />
				<span class="sr-only">{{ t("ui.prev-page") }}</span>
			</div>
		</NuxtLink>
		<div v-else class="cursor-not-allowed rounded-md border p-2 text-neutral-400 transition">
			<ChevronUpIcon class="h-5 w-5 -rotate-90" />
			<span class="sr-only">{{ t("ui.first-page") }}</span>
		</div>
		<div v-if="all != 0">
			{{
				t("ui.showing-results", {
					first: (page - 1) * limit + 1,
					last: Math.min(page * limit, all),
					all,
				})
			}}
		</div>
		<div v-else class="italic">{{ t("ui.no-results") }}</div>
		<NuxtLink
			v-if="page * limit < Number(all)"
			:to="{
				query: {
					...route.query,
					page: page + 1,
				},
			}"
		>
			<div
				class="cursor-pointer rounded-md border p-2 transition hover:bg-neutral-200 active:bg-neutral-300"
			>
				<ChevronUpIcon class="h-5 w-5 rotate-90" />
				<span class="sr-only">{{ t("ui.next-page") }}</span>
			</div>
		</NuxtLink>

		<div v-else class="cursor-not-allowed rounded-md border p-2 transition">
			<ChevronUpIcon class="h-5 w-5 rotate-90 text-neutral-400" />
			<span class="sr-only">{{ t("ui.last-page") }}</span>
		</div>
	</div>
</template>
