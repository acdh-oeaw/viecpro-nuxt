/* eslint-disable no-restricted-imports */
/* eslint-disable @next/next/no-img-element */

import type { ImageProps as NextImageProps } from "next/image";
import type { ReactNode } from "react";

import { Image } from "@/components/image";
import { getImageDimensions } from "@/lib/server/get-image-dimensions";

interface ServerImageProps extends Omit<NextImageProps, "loader"> {}

export async function ServerImage(props: Readonly<ServerImageProps>): Promise<ReactNode> {
	const { alt = "", decoding = "async", fill, height, loading = "lazy", src, width } = props;

	const dimensions =
		typeof src === "object" || fill === true || (width != null && height != null)
			? { width, height }
			: /** Get image dimensions when not provided. */
				await getImageDimensions(src);

	if (dimensions == null) {
		return <img {...props} alt={alt} decoding={decoding} loading={loading} src={src as string} />;
	}

	return (
		<Image
			{...props}
			alt={alt}
			decoding={decoding}
			height={dimensions.height}
			loading={loading}
			width={dimensions.width}
		/>
	);
}
