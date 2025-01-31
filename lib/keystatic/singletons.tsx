import { createLabel, createSingleton, withI18nPrefix } from "@acdh-oeaw/keystatic-lib";
import { fields, singleton } from "@keystatic/core";

import * as validation from "@/lib/keystatic/validation";

export const createIndexPage = createSingleton("/index-page/", (paths, locale) => {
	return singleton({
		label: createLabel("Home page", locale),
		path: paths.contentPath,
		format: { data: "json" },
		entryLayout: "form",
		schema: {
			title: fields.text({
				label: "Title",
				validation: { isRequired: true },
			}),
			subtitle: fields.text({
				label: "Subtitle",
				validation: { isRequired: true },
			}),
			content: fields.mdx.inline({
				label: "Content",
				options: {
					blockquote: false,
					image: false,
					table: false,
				},
				components: {},
			}),
			sections: fields.array(
				fields.object(
					{
						title: fields.text({
							label: "Title",
							validation: { isRequired: true },
						}),
						content: fields.mdx.inline({
							label: "Content",
							options: {
								blockquote: false,
								image: false,
								table: false,
							},
							components: {},
						}),
						links: fields.array(
							fields.object(
								{
									label: fields.text({
										label: "Label",
										validation: { isRequired: true },
									}),
									href: fields.url({
										label: "URL",
										validation: { isRequired: true },
									}),
								},
								{
									label: "Link",
								},
							),
							{
								label: "Links",
								validation: { length: { min: 0 } },
								itemLabel(props) {
									return props.fields.label.value;
								},
							},
						),
					},
					{
						label: "Section",
					},
				),
				{
					label: "Sections",
					validation: { length: { min: 1 } },
					itemLabel(props) {
						return props.fields.title.value;
					},
				},
			),
		},
	});
});

export const createMetadata = createSingleton("/metadata/", (paths, locale) => {
	return singleton({
		label: createLabel("Metadata", locale),
		path: paths.contentPath,
		format: { data: "json" },
		entryLayout: "form",
		schema: {
			title: fields.text({
				label: "Title",
				validation: { isRequired: true },
			}),
			description: fields.text({
				label: "Description",
				validation: { isRequired: true },
			}),
			twitter: fields.object(
				{
					creator: fields.text({
						label: "Creator",
						validation: { isRequired: true, pattern: validation.twitter },
					}),
					site: fields.text({
						label: "Site",
						validation: { isRequired: true, pattern: validation.twitter },
					}),
				},
				{
					label: "Twitter",
				},
			),
			manifest: fields.object(
				{
					name: fields.text({
						label: "Name",
						validation: { isRequired: true },
					}),
					"short-name": fields.text({
						label: "Short name",
						validation: { isRequired: true },
					}),
					description: fields.text({
						label: "Description",
						validation: { isRequired: true },
					}),
				},
				{
					label: "Webmanifest",
				},
			),
		},
	});
});

export const createDocumentationNav = createSingleton("/documentation-nav/", (paths, locale) => {
	return singleton({
		label: createLabel("Documentation navigation", locale),
		path: paths.contentPath,
		format: { data: "json" },
		entryLayout: "form",
		schema: {
			links: fields.array(
				fields.object(
					{
						label: fields.text({
							label: "Label",
							validation: { isRequired: true },
						}),
						id: fields.relationship({
							label: "Page",
							validation: { isRequired: true },
							collection: withI18nPrefix("documentation", locale),
						}),
					},
					{
						label: "Link",
					},
				),
				{
					label: "Links",
					itemLabel(props) {
						return props.fields.label.value;
					},
					validation: { length: { min: 1 } },
				},
			),
		},
	});
});
