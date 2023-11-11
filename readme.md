# viecpro frontend

frontend for the [apis instance](https://viecpro-dev.acdh-dev.oeaw.ac.at/) of the
[viecpro project](https://viecpro.oeaw.ac.at/) ("the viennese court. a prosopographical portal").

## how to run

prerequisites:

- [Node.js v20](https://nodejs.org/en/download)
- [pnpm](https://pnpm.io/installation)

set required environment variables in `.env.local`:

```bash
cp .env.example .env.local
```

also, set environment variables required by github actions. use
["variables"](https://github.com/acdh-oeaw/template-app-nuxt/settings/variables/actions) for every
environment variable prefixed with `NUXT_PUBLIC_`, and
["secrets"](https://github.com/acdh-oeaw/template-app-nuxt/settings/secrets/actions) for all others.

install dependencies:

```bash
pnpm install
```

run a development server on [http://localhost:3000](http://localhost:3000):

```bash
pnpm run dev
```
