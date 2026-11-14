import { Link as ContentLink } from "#/components/content/link.tsx";
import { LinkButton } from "#/components/content/link-button.tsx";
import { Link } from "#/components/link.tsx";
import { ServerImage as Image } from "#/components/server-image.tsx";

const components = {
	a: Link,
	img: Image,
	Link: ContentLink,
	LinkButton,
};

declare global {
	type MDXProvidedComponents = typeof components;
}

export function useMDXComponents(): MDXProvidedComponents {
	return components;
}
