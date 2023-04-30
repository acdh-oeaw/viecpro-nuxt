<script lang="ts" setup>
import { type NuxtLinkProps } from "#app";
import { NuxtLink } from "#components";
import { useLocalePath } from "#imports";

const props = defineProps<
	Omit<NuxtLinkProps, "href" | "to"> & Required<Pick<NuxtLinkProps, "href">>
>();

const localePath = useLocalePath();
</script>

<template>
	<NuxtLink :href="localePath(props.href as any)">
		<slot />
	</NuxtLink>
</template>
