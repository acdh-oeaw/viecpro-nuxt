import { log } from "@acdh-oeaw/lib";
import { ValidationError, createEnv } from "@acdh-oeaw/validate-env/next";
import * as v from "valibot";

function parse<TSchema extends v.GenericSchema>(
	schema: TSchema,
	input: unknown,
): v.InferOutput<TSchema> {
	const result = v.safeParse(schema, input);

	if (!result.success) {
		const message = "Invalid environment variables";

		log.error(`${message}:`, v.flatten(result.issues).nested);

		const error = new ValidationError(message);
		delete error.stack;

		throw error;
	}

	return result.output;
}

export const env = createEnv({
	schemas: {
		system(input) {
			const Schema = v.object({
				NODE_ENV: v.optional(v.picklist(["development", "production", "test"]), "production"),
			});

			return parse(Schema, input);
		},
		private(input) {
			const Schema = v.object({
				BUILD_MODE: v.optional(v.picklist(["export", "standalone"])),
				CI: v.optional(v.pipe(v.unknown(), v.transform(Boolean), v.boolean())),
			});

			return parse(Schema, input);
		},
		public(input) {
			const Schema = v.object({
				NEXT_PUBLIC_API_BASE_URL: v.pipe(v.string(), v.url()),
				NEXT_PUBLIC_APP_BASE_URL: v.pipe(v.string(), v.url()),
				NEXT_PUBLIC_BOTS: v.optional(v.picklist(["disabled", "enabled"]), "disabled"),
				NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: v.optional(v.string()),
				NEXT_PUBLIC_MATOMO_BASE_URL: v.optional(v.pipe(v.string(), v.url())),
				NEXT_PUBLIC_MATOMO_ID: v.optional(
					v.pipe(v.string(), v.transform(Number), v.number(), v.integer(), v.minValue(1)),
				),
				NEXT_PUBLIC_REDMINE_ID: v.pipe(
					v.string(),
					v.transform(Number),
					v.number(),
					v.integer(),
					v.minValue(1),
				),
				NEXT_PUBLIC_TYPESENSE_COLLECTION_PREFIX: v.pipe(v.string(), v.nonEmpty()),
				NEXT_PUBLIC_TYPESENSE_HOST: v.pipe(v.string(), v.nonEmpty()),
				NEXT_PUBLIC_TYPESENSE_PORT: v.pipe(
					v.string(),
					v.transform(Number),
					v.number(),
					v.integer(),
					v.minValue(1),
				),
				NEXT_PUBLIC_TYPESENSE_PROTOCOL: v.picklist(["http", "https"]),
				NEXT_PUBLIC_TYPESENSE_SEARCH_API_KEY: v.pipe(v.string(), v.nonEmpty()),
			});

			return parse(Schema, input);
		},
	},
	environment: {
		BUILD_MODE: process.env.BUILD_MODE,
		CI: process.env.CI,
		NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
		NEXT_PUBLIC_APP_BASE_URL: process.env.NEXT_PUBLIC_APP_BASE_URL,
		NEXT_PUBLIC_BOTS: process.env.NEXT_PUBLIC_BOTS,
		NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
		NEXT_PUBLIC_MATOMO_BASE_URL: process.env.NEXT_PUBLIC_MATOMO_BASE_URL,
		NEXT_PUBLIC_MATOMO_ID: process.env.NEXT_PUBLIC_MATOMO_ID,
		NEXT_PUBLIC_REDMINE_ID: process.env.NEXT_PUBLIC_REDMINE_ID,
		NEXT_PUBLIC_TYPESENSE_COLLECTION_PREFIX: process.env.NEXT_PUBLIC_TYPESENSE_COLLECTION_PREFIX,
		NEXT_PUBLIC_TYPESENSE_HOST: process.env.NEXT_PUBLIC_TYPESENSE_HOST,
		NEXT_PUBLIC_TYPESENSE_PORT: process.env.NEXT_PUBLIC_TYPESENSE_PORT,
		NEXT_PUBLIC_TYPESENSE_PROTOCOL: process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL,
		NEXT_PUBLIC_TYPESENSE_SEARCH_API_KEY: process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_API_KEY,
		NODE_ENV: process.env.NODE_ENV,
	},
	validation: v.parse(
		v.optional(v.picklist(["disabled", "enabled", "public"]), "enabled"),
		process.env.ENV_VALIDATION,
	),
});
