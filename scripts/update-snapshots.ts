/**
 * Regenerates visual snapshots on the ci runner image.
 *
 * Font rendering differs between operating systems and distributions, so snapshots generated
 * locally will most likely not match what ci renders. This script dispatches the `validate`
 * workflow with `update-snapshots: true` for the current branch, waits for it to finish, and
 * copies the regenerated snapshots into `./e2e/snapshots/`.
 *
 * Requires the github cli (`gh`), authenticated with access to the repository, and the current
 * branch to be pushed.
 *
 * Usage:
 *
 * ```bash
 * pnpm run test:e2e:update-snapshots:ci
 * # download snapshots from an already finished run
 * pnpm run test:e2e:update-snapshots:ci --run <run-id>
 * ```
 */

import { execFile, spawn } from "node:child_process";
import { cp, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { parseArgs } from "node:util";

import { log } from "@acdh-oeaw/lib";

const workflow = "validate.yaml";
const artifact = "snapshots";
const snapshotsDir = join(process.cwd(), "e2e", "snapshots");

/** Runs a command and returns its trimmed stdout. */
function exec(command: string, args: Array<string>): Promise<string> {
	return new Promise((resolve, reject) => {
		execFile(command, args, (error, stdout, stderr) => {
			if (error != null) {
				reject(new Error(`\`${command} ${args.join(" ")}\` failed.\n${stderr}`, { cause: error }));
			} else {
				resolve(stdout.trim());
			}
		});
	});
}

/** Runs a command with inherited stdio, so progress output is visible. */
function run(command: string, args: Array<string>): Promise<void> {
	return new Promise((resolve, reject) => {
		const child = spawn(command, args, { stdio: "inherit" });
		child.on("error", reject);
		child.on("close", (code) => {
			if (code === 0) {
				resolve();
			} else {
				reject(new Error(`\`${command} ${args.join(" ")}\` exited with code ${String(code)}.`));
			}
		});
	});
}

interface WorkflowRun {
	createdAt: string;
	databaseId: number;
	headSha: string;
}

async function dispatch(): Promise<number> {
	const branch = await exec("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
	const sha = await exec("git", ["rev-parse", "HEAD"]);
	const upstream = await exec("git", ["rev-parse", "@{upstream}"]).catch(() => {
		return null;
	});

	if (upstream !== sha) {
		throw new Error(
			`Branch "${branch}" has unpushed changes (or no upstream). Push it first, since snapshots are generated from the remote branch.`,
		);
	}

	const dispatchedAt = Date.now();

	log.info(`Dispatching "${workflow}" with \`update-snapshots\` on branch "${branch}".`);
	await exec("gh", ["workflow", "run", workflow, "--ref", branch, "-f", "update-snapshots=true"]);

	/** `gh workflow run` does not return the run id, so poll for the newly created run. */
	for (let attempt = 0; attempt < 20; attempt++) {
		// oxlint-disable-next-line no-await-in-loop
		await sleep(3000);

		// oxlint-disable-next-line no-await-in-loop
		const output = await exec("gh", [
			"run",
			"list",
			"--workflow",
			workflow,
			"--branch",
			branch,
			"--event",
			"workflow_dispatch",
			"--limit",
			"5",
			"--json",
			"createdAt,databaseId,headSha",
		]);
		const runs = JSON.parse(output) as Array<WorkflowRun>;

		const match = runs.find((candidate) => {
			/** Allow for some clock skew between local machine and github. */
			return (
				candidate.headSha === sha &&
				new Date(candidate.createdAt).getTime() >= dispatchedAt - 60_000
			);
		});

		if (match != null) {
			return match.databaseId;
		}
	}

	throw new Error("Could not find the dispatched workflow run.");
}

async function download(runId: number): Promise<void> {
	const tmp = await mkdtemp(join(tmpdir(), "viecpro-snapshots-"));

	try {
		await exec("gh", ["run", "download", String(runId), "--name", artifact, "--dir", tmp]);
		await cp(tmp, snapshotsDir, { recursive: true, force: true });
	} finally {
		await rm(tmp, { recursive: true, force: true });
	}
}

async function main(): Promise<void> {
	const { values } = parseArgs({
		options: {
			run: { type: "string" },
		},
	});

	const runId = values.run != null ? Number(values.run) : await dispatch();

	if (Number.isNaN(runId)) {
		throw new Error(`Invalid run id "${String(values.run)}".`);
	}

	if (values.run == null) {
		log.info(`Waiting for workflow run ${String(runId)}.`);
		await run("gh", ["run", "watch", String(runId), "--exit-status"]);
	}

	await download(runId);

	log.success("Updated snapshots. Review the changes with `git status` and `git diff`.");
}

main().catch((error: unknown) => {
	log.error("Failed to update snapshots.\n", error);
	process.exitCode = 1;
});
