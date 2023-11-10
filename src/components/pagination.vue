<script setup lang="ts">
import { ChevronUp } from "lucide-vue-next";
import { type RouteLocationNormalized, useRoute } from "vue-router";

import { useI18n } from "@/composables/use-i18n";

const route: RouteLocationNormalized = useRoute();

defineProps<{
	page: number;
	limit: number;
	all: number;
}>();

const { t } = useI18n();
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
				class="cursor-pointer rounded border p-2 transition hover:bg-slate-200 active:bg-slate-300"
			>
				<ChevronUp class="h-5 w-5 -rotate-90" />
				<span class="sr-only">{{ t("ui.prev-page") }}</span>
			</div>
		</NuxtLink>
		<div v-else class="cursor-not-allowed rounded border p-2 text-gray-400 transition">
			<ChevronUp class="h-5 w-5 -rotate-90" />
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
				class="cursor-pointer rounded border p-2 transition hover:bg-slate-200 active:bg-slate-300"
			>
				<ChevronUp class="h-5 w-5 rotate-90" />
				<span class="sr-only">{{ t("ui.next-page") }}</span>
			</div>
		</NuxtLink>

		<div v-else class="cursor-not-allowed rounded border p-2 transition">
			<ChevronUp class="h-5 w-5 rotate-90 text-gray-400" />
			<span class="sr-only">{{ t("ui.last-page") }}</span>
		</div>
	</div>
</template>
