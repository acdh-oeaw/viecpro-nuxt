<script lang="ts" setup>
import { type NuxtLinkProps } from "#app";
import { NuxtLink } from "#components";
import { useLocalePath } from "#imports";

interface ClientLinkProps extends Omit<NuxtLinkProps, "href" | "to"> {
	href: NuxtLinkProps["href"];
}

const props = defineProps<ClientLinkProps>();

const localePath = useLocalePath();
</script>

<template>
	<NuxtLink :href="localePath(props.href as any)">
		<slot />
	</NuxtLink>
</template>
