import type { ReactNode } from "react";

import { Link as Anchor } from "#/components/link.tsx";
import { type ContentLink, getLinkProps } from "#/lib/content-link.ts";

interface LinkProps {
	children: ReactNode;
	className?: string;
	link: ContentLink;
}

export function Link(props: Readonly<LinkProps>): ReactNode {
	const { children, link, ...rest } = props;

	return (
		<Anchor {...rest} {...getLinkProps(link)}>
			{children}
		</Anchor>
	);
}
