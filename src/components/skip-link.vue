<script lang="ts" setup>
import { NuxtLink } from "#components";

const id = "main-content";
const hash = "#" + id;
</script>

<template>
	<NuxtLink
		class="fixed translate-y-[-120%] rounded bg-white px-4 py-3 text-black focus:translate-y-0"
		:href="{ hash }"
	>
		Skip to main content
	</NuxtLink>
</template>
