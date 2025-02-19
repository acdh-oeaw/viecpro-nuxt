# viecpro frontend

frontend for [viecpro](https://viecpro-backend.acdh-ch-dev.oeaw.ac.at).

## how to run

prerequisites:

- [node.js v22](https://nodejs.org/en/download)
- [pnpm v10](https://pnpm.io/installation)

> [!TIP]
>
> you can use `pnpm` to install the required node.js version with `pnpm env use 22 --global`

set required environment variables in `.env.local`:

```bash
cp .env.local.example .env.local
```

also, set environment variables required by [validation](./.github/workflows/validate.yml) and
[deployment](./.github/workflows/build-deploy.yml) github actions. use
["variables"](https://github.com/acdh-oeaw/viecpro-nuxt/settings/variables/actions) for every
environment variable prefixed with `NEXT_PUBLIC_`, and
["secrets"](https://github.com/acdh-oeaw/viecpro-nuxt/settings/secrets/actions) for all others.

- `NEXT_PUBLIC_REDMINE_ID` (required): service issue for this application in the acdh-ch
  [redmine](https://redmine.acdh.oeaw.ac.at) issue tracker.
- `NEXT_PUBLIC_APP_BASE_URL` (required): the base url for this application. the default of
  "http://localhost:3000" should be fine for local development.
- `NEXT_PUBLIC_BOTS` (required): whether this website can be indexed by web crawlers like the google
  bot. supported values are "disabled" and "enabled", defaults to "disabled".
- `NEXT_PUBLIC_MATOMO_BASE_URL` and `NEXT_PUBLIC_MATOMO_ID` (optional): set these to support
  client-side analytics with matomo.
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` (optional): set this to verify site ownership for google
  search console.
- `ENV_VALIDATION` (optional): whether to validate environment variables. supported values are
  "disabled", "enabled", and "public". defaults to "enabled". "public" only validates build-args
  prefixed with `NEXT_PUBLIC_`, which can make sense in a docker build context.

when adding new environment variables, don't forget to add them to
[`.env.local.example`](./.env.local.example) and [`config/env.config.ts`](./config/env.config.ts) as
well.

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
