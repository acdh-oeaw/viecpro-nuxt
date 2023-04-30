import { type Collection, collections } from "@/lib/search/collections.config";

export function isCollection(value: unknown): value is Collection {
	return typeof value === "string" && Object.keys(collections).includes(value);
}
