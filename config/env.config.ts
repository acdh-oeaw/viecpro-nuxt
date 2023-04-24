import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace NodeJS {
		interface ProcessEnv {
			BOTS?: string | undefined;
			BUNDLE_ANALYZER?: string | undefined;
			NEXT_PUBLIC_APP_BASE_URL?: string | undefined;
			NEXT_PUBLIC_MATOMO_BASE_URL?: string | undefined;
			NEXT_PUBLIC_MATOMO_ID?: string | undefined;
			NEXT_PUBLIC_REDMINE_ID?: string | undefined;
			NEXT_PUBLIC_TYPESENSE_API_KEY?: string | undefined;
			NEXT_PUBLIC_TYPESENSE_COLLECTION_PREFIX?: string | undefined;
			NEXT_PUBLIC_TYPESENSE_HOST?: string | undefined;
			NEXT_PUBLIC_TYPESENSE_PORT?: string | undefined;
			NEXT_PUBLIC_TYPESENSE_PROTOCOL?: string | undefined;
		}
	}
}

export const env = createEnv({
	server: {
		BOTS: z.enum(["disabled", "enabled"]).optional(),
		BUNDLE_ANALYZER: z.enum(["disabled", "enabled"]).optional(),
		NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
	},
	client: {
		NEXT_PUBLIC_APP_BASE_URL: z.string().url(),
		NEXT_PUBLIC_MATOMO_BASE_URL: z.string().url().optional(),
		NEXT_PUBLIC_MATOMO_ID: z.string().min(1).optional(),
		NEXT_PUBLIC_REDMINE_ID: z.coerce.number().min(1),
		NEXT_PUBLIC_TYPESENSE_API_KEY: z.string().min(1),
		NEXT_PUBLIC_TYPESENSE_COLLECTION_PREFIX: z.string().min(1),
		NEXT_PUBLIC_TYPESENSE_HOST: z.string().min(1),
		NEXT_PUBLIC_TYPESENSE_PORT: z.coerce.number().min(1),
		NEXT_PUBLIC_TYPESENSE_PROTOCOL: z.string().min(1),
	},
	runtimeEnv: {
		BOTS: process.env.BOTS,
		BUNDLE_ANALYZER: process.env.BUNDLE_ANALYZER,
		NODE_ENV: process.env.NODE_ENV,
		NEXT_PUBLIC_APP_BASE_URL: process.env.NEXT_PUBLIC_APP_BASE_URL,
		NEXT_PUBLIC_MATOMO_BASE_URL: process.env.NEXT_PUBLIC_MATOMO_BASE_URL,
		NEXT_PUBLIC_MATOMO_ID: process.env.NEXT_PUBLIC_MATOMO_ID,
		NEXT_PUBLIC_REDMINE_ID: process.env.NEXT_PUBLIC_REDMINE_ID,
		NEXT_PUBLIC_TYPESENSE_API_KEY: process.env.NEXT_PUBLIC_TYPESENSE_API_KEY,
		NEXT_PUBLIC_TYPESENSE_COLLECTION_PREFIX: process.env.NEXT_PUBLIC_TYPESENSE_COLLECTION_PREFIX,
		NEXT_PUBLIC_TYPESENSE_HOST: process.env.NEXT_PUBLIC_TYPESENSE_HOST,
		NEXT_PUBLIC_TYPESENSE_PORT: process.env.NEXT_PUBLIC_TYPESENSE_PORT,
		NEXT_PUBLIC_TYPESENSE_PROTOCOL: process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL,
	},
});
