<script lang="ts" setup>
const t = useTranslations();
const localePath = useLocalePath();
</script>

<template>
	<footer class="mt-2 border-t">
		<div
			class="mx-auto grid w-full max-w-[20rem] items-center gap-8 py-4 text-xs sm:max-w-container sm:grid-cols-7 sm:px-8 sm:text-sm"
		>
			<div>
				<img src="/assets/images/logo-ihb.svg" alt="" class="mx-auto max-h-[8rem]" />
			</div>
			<div class="mx-auto sm:col-span-2">
				<div>Österreichische Akademie der Wissenschaften</div>
				<div>Institute for Habsburg and Balkan Studies (IHB)</div>
				<div>Hollandstraße 11-13</div>
				<div>1020 Wien</div>
			</div>
			<div>
				<img class="mx-auto" src="/assets/images/logo-acdh-with-text.svg" alt="" />
			</div>
			<div>
				<img class="mx-auto" src="/assets/images/logo-oeaw.svg" alt="" />
			</div>
			<div>
				<img class="mx-auto" src="/assets/images/logo-fwf.svg" alt="" />
			</div>
			<div>
				<NuxtLink class="text-lg hover:underline" :href="localePath('/imprint')">
					{{ t("common.imprint") }}
				</NuxtLink>
			</div>
		</div>
	</footer>
</template>
