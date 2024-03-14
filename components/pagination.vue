<script setup lang="ts">
import { ChevronUp } from "lucide-vue-next";

const route = useRoute();

defineProps<{
	page: number;
	limit: number;
	all: number;
}>();

const t = useTranslations();
</script>

<template>
	<div class="grid grid-cols-2 items-center gap-2 lg:grid-cols-[1fr_auto_1fr]">
		<div class="flex items-center gap-1">
			<NuxtLink
				v-if="page > 1"
				data-testid="prevPage"
				:to="{
					query: {
						...route.query,
						page: page - 1,
					},
				}"
			>
				<div
					class="w-fit cursor-pointer rounded border p-2 transition hover:bg-slate-200 active:bg-slate-300"
				>
					<ChevronUp class="h-5 w-5 -rotate-90" />
					<span class="sr-only">{{ t("ui.prev-page") }}</span>
				</div>
			</NuxtLink>
			<div v-else class="w-fit cursor-not-allowed rounded border p-2 text-gray-400 transition">
				<ChevronUp class="h-5 w-5 -rotate-90" />
				<span class="sr-only">{{ t("ui.first-page") }}</span>
			</div>
			<div class="flex flex-wrap justify-center gap-1">
				<NuxtLink v-if="page > 3" class="underline" :to="{ query: { ...route.query, page: 1 } }"
					>1</NuxtLink
				>
				<span v-if="page > 4">...</span>
				<template v-for="n in 5" :key="n - 3 + page">
					<NuxtLink
						v-if="n - 3 + page >= 1 && n - 3 + page <= Math.ceil(all / limit)"
						:class="n === 3 ? 'font-semibold' : 'underline'"
						:to="{ query: { ...route.query, page: n - 3 + page } }"
					>
						{{ n - 3 + page }}
					</NuxtLink>
				</template>
				<span v-if="page + 3 < Math.ceil(all / limit)">...</span>
				<NuxtLink
					v-if="page + 2 < Math.ceil(all / limit)"
					class="underline"
					:to="{ query: { ...route.query, page: Math.ceil(all / limit) } }"
				>
					{{ Math.ceil(all / limit) }}
				</NuxtLink>
			</div>
		</div>
		<div class="mx-auto hidden lg:block">
			<div v-if="all != 0">
				<div>
					{{
						t("ui.showing-results", {
							first: (page - 1) * limit + 1,
							last: Math.min(page * limit, all),
							all,
						})
					}}
				</div>
			</div>
			<div v-else class="italic">{{ t("ui.no-results") }}</div>
		</div>
		<div class="flex items-center justify-end gap-2">
			<div class="flex items-center gap-1">
				<span>{{ t("ui.per-page") }}:</span>
				<NuxtLink
					v-for="option in [10, 25, 50, 100]"
					:key="option"
					:class="
						(!route.query.limit && option === 25) || option === Number(route.query.limit)
							? 'font-semibold'
							: 'underline'
					"
					:to="{
						query: {
							...route.query,
							page: 1,
							limit: option,
						},
					}"
				>
					{{ option }}
				</NuxtLink>
			</div>

			<NuxtLink
				v-if="page * limit < Number(all)"
				data-testid="nextPage"
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
	</div>
</template>
