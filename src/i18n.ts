import { getRequestConfig } from "next-intl/server";

// eslint-disable-next-line import/no-default-export
export default getRequestConfig(async ({ locale }) => {
	return {
		messages: (await import(`@/messages/${locale}.json`)).default,
	};
});
