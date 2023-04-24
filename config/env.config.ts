import { log } from "@stefanprobst/log";
import { type SafeParseReturnType, z } from "zod";

const schema = {
	server: z.object({
		NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
	}),
	client: z.object({
		VITE_APP_BASE_URL: z.string().min(1),
		VITE_MATOMO_BASE_URL: z.string().optional(),
		VITE_MATOMO_ID: z.string().optional(),
		VITE_REDMINE_ID: z.coerce.number(),
		VITE_TYPESENSE_API_KEY: z.string().min(1),
		VITE_TYPESENSE_COLLECTION_PREFIX: z.string().min(1),
		VITE_TYPESENSE_HOST: z.string().min(1),
		VITE_TYPESENSE_PORT: z.coerce.number(),
		VITE_TYPESENSE_PROTOCOL: z.string().min(1),
	}),
};

const isServer = import.meta.env.SSR === true;

const skip = import.meta.env.ENV_VALIDATION === "disabled";

const environment: Record<
	keyof z.infer<typeof schema.client> | keyof z.infer<typeof schema.server>,
	boolean | string | undefined
> = {
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
};

const result = (
	skip
		? { data: environment, success: true }
		: isServer
		? schema.server.merge(schema.client).safeParse(environment)
		: schema.client.safeParse(environment)
) satisfies // eslint-disable-next-line @typescript-eslint/no-explicit-any
SafeParseReturnType<any, any>;

if (result.success === false) {
	const message = "Invalid environment variables";
	log.error(message + "\n", result.error.flatten().fieldErrors);
	throw new Error(message);
}

const env = result.data as z.infer<typeof schema.client> & z.infer<typeof schema.server>;

export { env };
