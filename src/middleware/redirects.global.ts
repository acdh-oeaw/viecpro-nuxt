export default defineNuxtRouteMiddleware((to, _from) => {
	if (to.path === "/documentation") {
		return navigateTo("/documentation/data");
	}
	if (to.path === "/de/documentation") {
		return navigateTo("/de/documentation/data");
	}
	if (to.path === "/en/documentation") {
		return navigateTo("/en/documentation/data");
	}

	if (to.path === "/search") {
		return navigateTo("/search/courts");
	}
	if (to.path === "/de/search") {
		return navigateTo("/de/search/courts");
	}
	if (to.path === "/en/search") {
		return navigateTo("/en/search/courts");
	}
});
