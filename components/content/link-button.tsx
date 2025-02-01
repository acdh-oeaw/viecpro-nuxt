import { cn } from "@acdh-oeaw/style-variants";
import type { ReactNode } from "react";

import { Link } from "@/components/content/link";
import type { LinkSchema } from "@/lib/keystatic/get-link-props";

interface LinkButtonProps {
	children: ReactNode;
	className?: string;
	link: LinkSchema;
}

export function LinkButton(props: Readonly<LinkButtonProps>): ReactNode {
	const { children, className, ...rest } = props;

	return (
		<Link
			{...rest}
			className={cn(
				"inline-flex w-fit items-center gap-x-2 rounded-lg border border-brand-600 bg-brand-600 px-4 py-2 text-sm font-medium text-white no-underline shadow-sm transition",
				"focus-visible:focus-outline hover:border-brand-700 hover:bg-brand-700 pressed:border-brand-800 pressed:bg-brand-800",
				className,
			)}
		>
			{children}
		</Link>
	);
}
