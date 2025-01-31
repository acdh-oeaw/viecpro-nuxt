import { Link as ContentLink } from "@/components/content/link";
import { LinkButton } from "@/components/content/link-button";
import { Link } from "@/components/link";
import { ServerImage as Image } from "@/components/server-image";

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
