# VieCPro frontend

frontend for the [APIS-instance](https://viecpro-dev.acdh-dev.oeaw.ac.at/) of the
[VieCPro project](https://viecpro.oeaw.ac.at/).

deployed at <https://viecpro-frontend.acdh-ch-dev.oeaw.ac.at>.

## how to run

prerequisites:

- [node.js 22.x](https://nodejs.org/en/download)
- [pnpm 9.x](https://pnpm.io/installation)

set required environment variables in `.env.local`:

```bash
# Unix
cp .env.local.example .env.local

# Windows
copy .env.local.example .env.local
```

install dependencies:

```bash
pnpm install
```

run a development server on <http://localhost:3000>:

```bash
pnpm run dev
```

build for production:

```bash
pnpm run build
```
