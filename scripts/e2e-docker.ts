/**
 * Runs e2e tests in the same playwright container image ci uses, so visual snapshots rendered
 * locally match the ones rendered in ci.
 *
 * The repository is mounted into the container, but `node_modules`, `.next` and the pnpm store
 * live in docker volumes, so native dependencies are installed for the container platform and the
 * local build output is left untouched.
 *
 * All arguments are passed through to `playwright test`.
 *
 * Usage:
 *
 * ```bash
 * pnpm run test:e2e:docker
 * pnpm run test:e2e:docker --update-snapshots
 * pnpm run test:e2e:docker e2e/tests/pages/imprint.test.ts --project chromium
 * ```
 */

import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { log } from "@acdh-oeaw/lib";

interface PackageJson {
	devDependencies: Record<string, string>;
	devEngines: { packageManager: { version: string } };
}

/** Docker volume names must be lowercase alphanumeric, with `_.-` allowed after the first character. */
const volumePrefix = "viecpro-e2e";

function quote(value: string): string {
	return `'${value.replaceAll("'", String.raw`'\''`)}'`;
}

function run(command: string, args: Array<string>): Promise<void> {
	return new Promise((resolve, reject) => {
		const child = spawn(command, args, { stdio: "inherit" });
		child.on("error", reject);
		child.on("close", (code) => {
			if (code === 0) {
				resolve();
			} else {
				reject(new Error(`\`${command}\` exited with code ${String(code)}.`));
			}
		});
	});
}

async function main(): Promise<void> {
	const cwd = process.cwd();
	const pkg = JSON.parse(await readFile(join(cwd, "package.json"), "utf-8")) as PackageJson;

	const playwrightVersion = pkg.devDependencies["@playwright/test"];
	const pnpmVersion = pkg.devEngines.packageManager.version;

	if (playwrightVersion == null || !/^\d+\.\d+\.\d+$/.test(playwrightVersion)) {
		throw new Error(
			`\`@playwright/test\` must be pinned to an exact version to select the container image, got "${String(playwrightVersion)}".`,
		);
	}

	/** Keep in sync with `.github/workflows/validate.yaml`. */
	const image = `mcr.microsoft.com/playwright:v${playwrightVersion}-resolute`;

	const playwrightArgs = process.argv
		.slice(2)
		.map((arg) => {
			return quote(arg);
		})
		.join(" ");

	/** Hand files written to the mounted repository (snapshots, reports) back to the host user. */
	const owner =
		typeof process.getuid === "function" && typeof process.getgid === "function"
			? `${String(process.getuid())}:${String(process.getgid())}`
			: null;

	const script = [
		"set -e",
		`npm install --global --silent pnpm@${pnpmVersion}`,
		"pnpm install --frozen-lockfile --store-dir /pnpm-store",
		"pnpm run build",
		`status=0; pnpm exec playwright test ${playwrightArgs} || status=$?`,
		owner != null
			? `chown -R ${owner} e2e/snapshots test-results playwright-report 2>/dev/null || true`
			: "",
		'exit "$status"',
	]
		.filter(Boolean)
		.join("\n");

	log.info(`Running e2e tests in "${image}".`);

	await run("docker", [
		"run",
		"--rm",
		"--init",
		/** Recommended by playwright, chromium can run out of memory otherwise. */
		"--ipc=host",
		/** Ci runs on x64; rendering can differ on arm64. */
		"--platform=linux/amd64",
		`--volume=${cwd}:/work`,
		`--volume=${volumePrefix}-node-modules:/work/node_modules`,
		`--volume=${volumePrefix}-next:/work/.next`,
		`--volume=${volumePrefix}-pnpm-store:/pnpm-store`,
		"--workdir=/work",
		image,
		"bash",
		"-c",
		script,
	]);
}

main().catch((error: unknown) => {
	log.error("Failed to run e2e tests in docker.\n", error);
	process.exitCode = 1;
});
