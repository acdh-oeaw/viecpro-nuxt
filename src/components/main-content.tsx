import { type ReactNode } from "react";

export const id = "main-content";

interface MainContentProps {
	children: ReactNode;
}

export function MainContent(props: MainContentProps): JSX.Element {
	const { children } = props;

	return (
		<main className="focus:outline-none" id={id} tabIndex={-1}>
			{children}
		</main>
	);
}
