import { NotEditable, type ParsedValueForComponentSchema } from "@keystatic/core";
import type { ReactNode } from "react";

import type { createLinkSchema } from "@/lib/keystatic/create-link-schema";

type LinkSchema = ParsedValueForComponentSchema<ReturnType<typeof createLinkSchema>>;

interface HeadingIdPreviewProps {
	children: ReactNode;
}

export function HeadingIdPreview(props: Readonly<HeadingIdPreviewProps>): ReactNode {
	const { children } = props;

	return (
		<NotEditable className="inline">
			<span className="border-brand-100 bg-brand-50 px-2 text-brand-500 opacity-50">
				{"#"}
				{children}
			</span>
		</NotEditable>
	);
}

interface LinkButtonPreviewProps {
	children: ReactNode;
	link: LinkSchema;
}

export function LinkButtonPreview(props: Readonly<LinkButtonPreviewProps>): ReactNode {
	const { children, link: _link } = props;

	return (
		<div className="inline-flex min-h-12 items-center rounded-lg border border-brand-600 bg-brand-600 px-6 py-2.5 font-bold text-white shadow-sm hover:border-brand-700 hover:bg-brand-700 pressed:border-brand-800 pressed:bg-brand-800">
			{children}
		</div>
	);
}
