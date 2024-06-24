# VieCPro Frontend

Frontend for the [APIS-Instance](https://viecpro-dev.acdh-dev.oeaw.ac.at/) of the
[VieCPro project](https://viecpro.oeaw.ac.at/).

There is a live build available at
[viecpro-frontend.acdh-ch-dev.oeaw.ac.at](https://viecpro-frontend.acdh-ch-dev.oeaw.ac.at/).

## How to run

Prerequisites: [Node.js v20](https://nodejs.org/en/download) and
[pnpm v9](https://pnpm.io/installation)

Set required environment variables in `.env`:

```bash
# Unix
cp .env.local.example .env.local

# Windows
copy .env.local.example .env.local
```

Install dependencies:

```bash
pnpm install
```

Run a development server on <http://localhost:3000>:

```bash
pnpm run dev
```

Build for production:

```bash
pnpm run build
```

## How to deploy

Commits pushed to the `main` branch will automatically be deployed to the ACDH-CH cluster via GitHub
Actions.
