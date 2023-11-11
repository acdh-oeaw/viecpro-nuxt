import { nanoid } from "nanoid";

interface Toast {
	id: string;
	title: string;
	description: string;
	duration?: number;
	variant?: "default" | "negative";
	type?: "background" | "foreground";
}

export const useToastsStore = defineStore("toasts", () => {
	const toasts = ref<Map<Toast["id"], Toast>>(new Map());

	function addToast(toast: Omit<Toast, "id"> & Partial<Pick<Toast, "id">>) {
		const id = toast.id ?? nanoid();

		toasts.value.set(id, { ...toast, id });
	}

	function removeToast(id: Toast["id"]) {
		toasts.value.delete(id);
	}

	return {
		addToast,
		removeToast,
		toasts,
	};
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useToastsStore, import.meta.hot));
}
