<script lang="ts" setup>
const toastsStore = useToastsStore();
const { removeToast } = toastsStore;
const { toasts } = storeToRefs(toastsStore);

const toast = computed(() => {
	return toasts.value.values().next().value;
});

const isExiting = ref(false);

function onClose(id: string) {
	isExiting.value = true;
	/** Allow exit animation to finish. */
	setTimeout(() => {
		removeToast(id);
		isExiting.value = false;
	}, 150);
}
</script>

<template>
	<ToastProvider>
		<Toast
			v-if="toast != null"
			:duration="toast.duration"
			:type="toast.type"
			:variant="toast.variant"
			:open="!isExiting"
			@update:open="
				(value: boolean) => {
					if (value === false) {
						onClose(toast.id);
					}
				}
			"
		>
			<div class="grid gap-1">
				<ToastTitle>{{ toast.title }}</ToastTitle>
				<ToastDescription>{{ toast.description }}</ToastDescription>
			</div>
			<ToastClose />
		</Toast>
	</ToastProvider>
</template>
