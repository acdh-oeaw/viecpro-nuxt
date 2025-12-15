import type { ReactNode } from "react";

import { env } from "@/config/env.config";

export function TailwindIndicator(): ReactNode {
	if (env.NODE_ENV !== "development") return null;

	return (
		<div
			className="fixed right-4 bottom-4 z-10 grid size-8 cursor-default place-content-center rounded-full bg-black font-code text-sm font-bold text-white shadow-lg select-none"
			role="status"
		>
			<span className="xs:hidden">{"2xs"}</span>
			<span className="max-xs:hidden sm:hidden">{"xs"}</span>
			<span className="max-sm:hidden md:hidden">{"sm"}</span>
			<span className="max-md:hidden lg:hidden">{"md"}</span>
			<span className="max-lg:hidden xl:hidden">{"lg"}</span>
			<span className="max-xl:hidden 2xl:hidden">{"xl"}</span>
			<span className="max-2xl:hidden 3xl:hidden">{"2xl"}</span>
			<span className="max-3xl:hidden">{"3xl"}</span>
		</div>
	);
}
