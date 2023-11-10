<script lang="ts" setup>
import { useI18n } from "@/composables/use-i18n";

const { t } = useI18n();
</script>

<template>
	<footer class="mt-2 border-t">
		<div
			class="mx-auto grid w-full max-w-[20rem] gap-8 px-8 py-4 text-xs sm:max-w-container sm:grid-cols-7 sm:text-sm"
		>
			<div>
				<img src="/assets/images/logo-ihb.svg" alt="" class="mx-auto max-h-[8rem]" />
			</div>
			<div class="sm:col-span-2">
				<div>Österreichische Akademie der Wissenschaften</div>
				<div>Institute for Habsburg and Balkan Studies (IHB)</div>
				<div>Hollandstraße 11-13</div>
				<div>1020 Wien</div>
			</div>
			<div>
				<img src="/assets/images/logo-acdh-with-text.svg" alt="" />
			</div>
			<div>
				<img src="/assets/images/logo-oeaw.svg" alt="" />
			</div>
			<div>
				<img src="/assets/images/logo-fwf.svg" alt="" />
			</div>
			<div>
				<span>{{ t("common.imprint") }}</span>
			</div>
		</div>
	</footer>
</template>
