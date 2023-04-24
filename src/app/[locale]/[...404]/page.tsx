import { notFound } from "next/navigation";

/**
 * Only a root `app/not-found.tsx` automatically handles unmatches URLS.
 * Since we want localised 404 pages, we need this manual trigger in a catch-all route.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/not-found
 */
export default function NotFoundPage(): JSX.Element {
	notFound();
}
