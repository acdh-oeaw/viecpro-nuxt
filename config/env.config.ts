import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	clientPrefix: "VITE_",
	server: {
		NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
	},
	client: {
		VITE_APP_BASE_URL: z.string().url(),
		VITE_MATOMO_BASE_URL: z.string().url().optional(),
		VITE_MATOMO_ID: z.string().optional(),
		VITE_REDMINE_ID: z.coerce.number(),
		VITE_TYPESENSE_API_KEY: z.string().min(1),
		VITE_TYPESENSE_COLLECTION_PREFIX: z.string().min(1),
		VITE_TYPESENSE_HOST: z.string().min(1),
		VITE_TYPESENSE_PORT: z.coerce.number(),
		VITE_TYPESENSE_PROTOCOL: z.string().min(1),
	},
	runtimeEnvStrict: {
		NODE_ENV: import.meta.env.NODE_ENV,
		VITE_APP_BASE_URL: import.meta.env.VITE_APP_BASE_URL,
		VITE_MATOMO_BASE_URL: import.meta.env.VITE_MATOMO_BASE_URL,
		VITE_MATOMO_ID: import.meta.env.VITE_MATOMO_ID,
		VITE_REDMINE_ID: import.meta.env.VITE_REDMINE_ID,
		VITE_TYPESENSE_API_KEY: import.meta.env.VITE_TYPESENSE_API_KEY,
		VITE_TYPESENSE_COLLECTION_PREFIX: import.meta.env.VITE_TYPESENSE_COLLECTION_PREFIX,
		VITE_TYPESENSE_HOST: import.meta.env.VITE_TYPESENSE_HOST,
		VITE_TYPESENSE_PORT: import.meta.env.VITE_TYPESENSE_PORT,
		VITE_TYPESENSE_PROTOCOL: import.meta.env.VITE_TYPESENSE_PROTOCOL,
	},
	skipValidation: import.meta.env.ENV_VALIDATION === "disabled",
});
