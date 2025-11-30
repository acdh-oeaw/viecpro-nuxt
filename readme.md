# viecpro frontend

frontend for [viecpro](https://viecpro-backend.acdh-ch-dev.oeaw.ac.at).

deployed at <https://viecpro.acdh.oeaw.ac.at>.

## how to run

prerequisites:

- [node.js v24](https://nodejs.org/en/download)
- [pnpm v10](https://pnpm.io/installation)

> [!TIP]
>
> you can use `pnpm` to install the required node.js version with `pnpm env use 24 --global`

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

visual snapshot tests should be run in the repository's devcontainer - or a comparable debian
bookworm based linux environment -, and can be updated with:

```bash
pnpm run test:e2e:update-snapshots
```

## how to re-generate bibliography

the bibliography is fetched from zotero via script. this does _not_ happen automatically on every
build. to re-generate the bibliography, run:

```bash
pnpm run generate:bibliography
```
