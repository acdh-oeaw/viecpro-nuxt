import { createComponent } from "@acdh-oeaw/keystatic-lib";
import { fields } from "@keystatic/core";
import { inline, mark, wrapper } from "@keystatic/core/content-components";
import { HashIcon, LinkIcon, SuperscriptIcon } from "lucide-react";

import { createLinkSchema } from "@/lib/keystatic/create-link-schema";
import { HeadingIdPreview, LinkButtonPreview } from "@/lib/keystatic/previews";

export const createFootnote = createComponent((_paths, _locale) => {
	return {
		Footnote: mark({
			label: "Footnote",
			icon: <SuperscriptIcon />,
			schema: {},
			className: "underline decoration-dotted align-super text-sm",
		}),
	};
});

export const createHeadingId = createComponent((_paths, _locale) => {
	return {
		HeadingId: inline({
			label: "HeadingId",
			description: "Add a custom link target to a heading.",
			icon: <HashIcon />,
			schema: {
				id: fields.text({
					label: "ID",
					validation: { isRequired: true },
				}),
			},
			ContentView(props) {
				const { value } = props;

				return <HeadingIdPreview>{value.id}</HeadingIdPreview>;
			},
		}),
	};
});

export const createLink = createComponent((paths, locale) => {
	return {
		Link: mark({
			label: "Link",
			icon: <LinkIcon />,
			schema: {
				link: createLinkSchema(paths.downloadPath, locale),
			},
			tag: "a",
		}),
	};
});

export const createLinkButton = createComponent((paths, locale) => {
	return {
		LinkButton: wrapper({
			label: "LinkButton",
			description: "Insert a link, which looks like a button.",
			icon: <LinkIcon />,
			schema: {
				link: createLinkSchema(paths.downloadPath, locale),
			},
			ContentView(props) {
				const { children, value } = props;

				return <LinkButtonPreview link={value.link}>{children}</LinkButtonPreview>;
			},
		}),
	};
});
