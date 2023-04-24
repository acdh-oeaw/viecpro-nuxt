import { LocaleSwitcher } from "@/components/locale-switcher";

export function AppHeader(): JSX.Element {
	return (
		<header>
			<LocaleSwitcher />
		</header>
	);
}
