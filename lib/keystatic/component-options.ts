export const linkKinds = [
	{ label: "Documentation", value: "documentation" },
	{ label: "Download", value: "download" },
	{ label: "External", value: "external" },
] as const;

export type LinkKind = (typeof linkKinds)[number]["value"];
