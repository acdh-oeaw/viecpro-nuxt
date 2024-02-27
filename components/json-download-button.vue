<script lang="ts" setup>
import { FileJson } from "lucide-vue-next";

import { downloadAsJson } from "@/lib/helpers";

const props = defineProps<{ data: object; name: string }>();

console.log(props.data);
</script>

<template>
	<button @click="downloadAsJson(data, name)">
		<span class="sr-only">Download as .JSON</span>
		<FileJson class="m-2 h-6 w-6 shrink-0" />
	</button>
</template>
