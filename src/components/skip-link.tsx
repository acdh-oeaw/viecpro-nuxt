import { Link } from "next-intl";
import { type ReactNode } from "react";

interface SkipLinkProps {
	children: ReactNode;
	id?: string;
	targetId: string;
}

export function SkipLink(props: SkipLinkProps): JSX.Element {
	const { children, id, targetId } = props;

	/**
	 * @see https://bugzilla.mozilla.org/show_bug.cgi?id=308064
	 */
	function onClick() {
		document.getElementById(targetId)?.focus();
	}

	return (
		<Link
			className="fixed -translate-y-full rounded bg-neutral-50 px-4 py-3 text-neutral-900 transition focus:translate-y-0"
			href={{ hash: targetId }}
			id={id}
			onClick={onClick}
		>
			{children}
		</Link>
	);
}
