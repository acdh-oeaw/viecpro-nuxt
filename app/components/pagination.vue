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
	<div
		class="grid grid-cols-[auto_1fr_auto] items-center justify-between gap-2 lg:grid-cols-[1fr_auto_1fr]"
	>
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
					<ChevronUp class="size-5 -rotate-90" />
					<span class="sr-only">{{ t("ui.prev-page") }}</span>
				</div>
			</NuxtLink>
			<div v-else class="w-fit cursor-not-allowed rounded border p-2 text-gray-400 transition">
				<ChevronUp class="size-5 -rotate-90" />
				<span class="sr-only">{{ t("ui.first-page") }}</span>
			</div>
			<PageIndicator
				:all="all"
				class="ml-1 hidden flex-wrap justify-center gap-1 md:flex"
				:limit="limit"
				:page="page"
			/>
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
		<div class="md:hidden">
			<PageIndicator :all="all" class="flex justify-center gap-1" :limit="limit" :page="page" />
			<PerPageSelector class="mx-auto flex justify-center gap-1" />
		</div>
		<div class="flex items-center justify-end gap-2">
			<PerPageSelector class="mr-1 hidden items-center gap-1 md:flex" />
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
					<ChevronUp class="size-5 rotate-90" />
					<span class="sr-only">{{ t("ui.next-page") }}</span>
				</div>
			</NuxtLink>

			<div v-else class="cursor-not-allowed rounded border p-2 transition">
				<ChevronUp class="size-5 rotate-90 text-gray-400" />
				<span class="sr-only">{{ t("ui.last-page") }}</span>
			</div>
		</div>
	</div>
</template>
