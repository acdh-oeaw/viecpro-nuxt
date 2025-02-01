"use client";

import { cn } from "@acdh-oeaw/style-variants";
import { useTranslations } from "next-intl";
import { type ReactNode, useEffect, useTransition } from "react";
import { Button } from "react-aria-components";

import { MainContent } from "@/components/main-content";
import { useRouter } from "@/lib/i18n/navigation";

interface InternalErrorProps {
	error: Error & { digest?: string };
	reset: () => void;
}

/** `React.lazy` requires default export. */
// eslint-disable-next-line import-x/no-default-export
export default function InternalError(props: Readonly<InternalErrorProps>): ReactNode {
	const { error, reset } = props;

	const t = useTranslations("Error");

	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<MainContent className="flex flex-col">
			<section className="grid flex-1 place-content-center place-items-center gap-y-8 py-16 xs:py-24">
				<h1 className="text-balance text-center font-heading text-5xl font-bold text-brand-600 md:text-6xl">
					{t("something-went-wrong")}
				</h1>
				<Button
					className={cn(
						"inline-flex min-h-8 items-center rounded-lg border border-brand-600 bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-md",
						"interactive focus-visible:focus-outline transition hover:border-brand-700 hover:bg-brand-700 pressed:border-brand-800 pressed:bg-brand-800",
					)}
					isPending={isPending}
					onPress={() => {
						startTransition(() => {
							router.refresh();
							reset();
						});
					}}
				>
					{t("try-again")}
				</Button>
			</section>
		</MainContent>
	);
}
