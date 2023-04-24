import { copyFile } from "node:fs/promises";
import { extname, join } from "node:path";

import generateFavicons, { generateSocialImage } from "@stefanprobst/favicons";
import { log } from "@stefanprobst/log";

import { defaultLocale } from "~/config/i18n.config";
import { manifestFileName, metadata, openGraphImageName } from "~/config/metadata.config";

async function generate() {
	const publicFolder = join(process.cwd(), "public");

	Object.entries(metadata).forEach(async ([locale, meta]) => {
		const inputFilePath = join(process.cwd(), meta.logo.path);
		const outputFolder = locale === defaultLocale ? publicFolder : join(publicFolder, meta.locale);

		await generateFavicons({
			fit: meta.logo.fit,
			inputFilePath,
			manifestFileName,
			maskable: meta.logo.maskable,
			name: meta.title,
			outputFolder,
			shortName: meta.shortTitle,
		});

		if (extname(inputFilePath) === ".svg") {
			await copyFile(inputFilePath, join(outputFolder, "icon.svg"));
		}

		await generateSocialImage(
			join(process.cwd(), meta.image.path),
			join(outputFolder, openGraphImageName),
			{ fit: meta.image.fit },
		);
	});
}

generate()
	.then(() => {
		log.success("Successfully generated favicons.");
	})
	.catch((error) => {
		const message = String(error);
		log.error("Failed to generate favicons.\n", message);
		process.exit(1);
	});
