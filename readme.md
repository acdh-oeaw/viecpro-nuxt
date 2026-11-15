# viecpro frontend

frontend for [viecpro](https://viecpro-backend.acdh-ch-dev.oeaw.ac.at).

deployed at <https://viecpro.acdh.oeaw.ac.at>.

## how to run

prerequisites:

- [node.js v26](https://nodejs.org/en/download)
- [pnpm v12](https://pnpm.io/installation)

> [!TIP]
>
> you can use `pnpm` to install the required node.js version with `pnpm env use 26 --global`

set required environment variables in `.env.local`:

```bash
cp .env.local.example .env.local
```

install dependencies:

```bash
pnpm install
```

run a development server on [http://localhost:3000](http://localhost:3000):

```bash
pnpm run dev
```

> [!TIP]
>
> this repository supports developing in containers. when opening the project in your editor, you
> should be prompted to re-open it in a devcontainer.

## how to test

generate a production build and run end-to-end tests with:

```bash
pnpm run build
pnpm run test:e2e
```

visual snapshots need to match what ci renders. ci runs in the official
[playwright container image](https://playwright.dev/docs/docker) (see
`.github/workflows/validate.yaml`), so font rendering is identical when running tests in the same
image locally, which requires [docker](https://docs.docker.com/get-started/get-docker/):

```bash
pnpm run test:e2e:docker
```

to regenerate visual snapshots locally, run:

```bash
pnpm run test:e2e:update-snapshots:docker
```

arguments are passed through to `playwright test`, e.g.
`pnpm run test:e2e:docker e2e/tests/pages/imprint.test.ts --project chromium`. the container uses
docker volumes for `node_modules`, `.next` and the pnpm store, so the first run takes a while.

alternatively, snapshots can be regenerated in ci, which requires the
[github cli](https://cli.github.com) to be installed and authenticated. push your branch and run:

```bash
pnpm run test:e2e:update-snapshots:ci
```

this dispatches the `validate` workflow with `update-snapshots` enabled, waits for it to finish, and
copies the regenerated snapshots to `e2e/snapshots/`. to only download snapshots from an already
finished run, pass `--run <run-id>`.

the container image tag is derived from the `@playwright/test` version, which therefore needs to be
pinned to an exact version in `package.json`.

## how to re-generate bibliography

the bibliography is fetched from zotero via script. this does _not_ happen automatically on every
build. to re-generate the bibliography, run:

```bash
pnpm run generate:bibliography
```
