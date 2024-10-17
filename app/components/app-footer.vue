<script lang="ts" setup>
const t = useTranslations();
</script>

<template>
	<footer class="mt-2 border-t">
		<div
			class="mx-auto grid w-full max-w-80 grid-cols-2 items-center gap-8 py-4 text-xs sm:max-w-container sm:grid-cols-7 sm:px-8 sm:text-sm"
		>
			<div>
				<img alt="" class="mx-auto max-h-32" src="/assets/images/logo-ihb.svg" />
			</div>
			<div class="mx-auto sm:col-span-2">
				<div>Österreichische Akademie der Wissenschaften</div>
				<div>Institute for Habsburg and Balkan Studies (IHB)</div>
				<div>Hollandstraße 11-13</div>
				<div>1020 Wien</div>
			</div>
			<div>
				<img alt="" class="mx-auto" src="/assets/images/logo-acdh-with-text.svg" />
			</div>
			<div>
				<img alt="" class="mx-auto" src="/assets/images/logo-oeaw.svg" />
			</div>
			<div>
				<img alt="" class="mx-auto" src="/assets/images/logo-fwf.svg" />
			</div>
			<div>
				<NuxtLink class="text-lg hover:underline" href="/imprint">
					{{ t("common.imprint") }}
				</NuxtLink>
			</div>
		</div>
	</footer>
</template>
