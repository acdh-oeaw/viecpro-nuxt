import { createEnv } from "@t3-oss/env-nuxt";
import { z } from "zod";

export const env = createEnv({
	server: {
		BOTS: z.enum(["disabled", "enabled"]).optional(),
		NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
	},
	client: {
		NUXT_PUBLIC_APP_BASE_URL: z.string().url(),
		NUXT_PUBLIC_MATOMO_BASE_URL: z.string().url().optional(),
		NUXT_PUBLIC_MATOMO_ID: z.string().optional(),
		NUXT_PUBLIC_REDMINE_ID: z.coerce.number(),
		NUXT_PUBLIC_TYPESENSE_API_KEY: z.string().min(1),
		NUXT_PUBLIC_TYPESENSE_COLLECTION_PREFIX: z.string().min(1),
		NUXT_PUBLIC_TYPESENSE_HOST: z.string().min(1),
		NUXT_PUBLIC_TYPESENSE_PORT: z.coerce.number(),
		NUXT_PUBLIC_TYPESENSE_PROTOCOL: z.string().min(1),
	},
	skipValidation: process.env.ENV_VALIDATION === "disabled",
});
