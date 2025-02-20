import {
	// createAssetOptions,
	createCollection,
	createContentFieldOptions,
	createLabel,
} from "@acdh-oeaw/keystatic-lib";
import { collection, fields } from "@keystatic/core";

import {
	createFootnote,
	createHeadingId,
	createLink,
	createLinkButton,
} from "@/lib/keystatic/components";
import { createPreviewUrl } from "@/lib/keystatic/create-preview-url";

export const createDocumentation = createCollection("/documentation/", (paths, locale) => {
	return collection({
		label: createLabel("Documentation pages", locale),
		path: paths.contentPath,
		format: { contentField: "content" },
		slugField: "title",
		columns: ["title"],
		entryLayout: "content",
		previewUrl: createPreviewUrl("/documentation/{slug}"),
		schema: {
			title: fields.slug({
				name: {
					label: "Title",
					validation: { isRequired: true },
				},
			}),
			lead: fields.text({
				label: "Lead",
				validation: { isRequired: false },
				multiline: true,
			}),
			// publicationDate: fields.date({
			// 	label: "Publication date",
			// 	validation: { isRequired: true },
			// 	defaultValue: { kind: "today" },
			// }),
			// image: fields.image({
			// 	label: "Image",
			// 	validation: { isRequired: true },
			// 	...createAssetOptions(paths.assetPath),
			// }),
			content: fields.mdx({
				label: "Content",
				options: {
					...createContentFieldOptions(paths),
				},
				components: {
					...createFootnote(paths, locale),
					...createHeadingId(paths, locale),
					...createLink(paths, locale),
					...createLinkButton(paths, locale),
				},
			}),
		},
	});
});
