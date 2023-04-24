import { type RouterConfig } from "@nuxt/schema";

const options: RouterConfig = {
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) return savedPosition;

		if (to.hash) return { el: to.hash };

		return { top: 0, left: 0 };
	},
};

export default options;
