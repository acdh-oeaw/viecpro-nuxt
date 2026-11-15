# syntax=docker/dockerfile:1

# using alpine base image to avoid `sharp` memory leaks.
# @see https://sharp.pixelplumbing.com/install#linux-memory-allocator

# build
FROM node:26-alpine AS build

# ci passes the version resolved from `devEngines.packageManager.version` in `package.json`.
ARG PNPM_VERSION
RUN npm install --global "pnpm@${PNPM_VERSION:?build arg PNPM_VERSION is required}"

RUN mkdir /app && chown -R node:node /app
WORKDIR /app

USER node

COPY --chown=node:node package.json pnpm-lock.yaml pnpm-workspace.yaml ./

ENV CI=true

RUN pnpm fetch

COPY --chown=node:node ./ ./

ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_APP_BASE_URL
ARG NEXT_PUBLIC_BOTS
ARG NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
ARG NEXT_PUBLIC_MATOMO_BASE_URL
ARG NEXT_PUBLIC_MATOMO_ID
ARG NEXT_PUBLIC_REDMINE_ID
ARG NEXT_PUBLIC_TYPESENSE_COLLECTION_PREFIX
ARG NEXT_PUBLIC_TYPESENSE_HOST
ARG NEXT_PUBLIC_TYPESENSE_PORT
ARG NEXT_PUBLIC_TYPESENSE_PROTOCOL
ARG NEXT_PUBLIC_TYPESENSE_SEARCH_API_KEY

# disable validation for runtime environment variables
ENV ENV_VALIDATION=public

RUN pnpm install --frozen-lockfile --offline

ENV BUILD_MODE=standalone
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm run build

# serve
FROM node:26-alpine AS serve

RUN mkdir /app && chown -R node:node /app
WORKDIR /app

USER node

COPY --from=build --chown=node:node /app/next.config.ts ./
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
# content needs to be available at request time.
COPY --from=build --chown=node:node /app/content ./content

# ensure folder is owned by node:node when mounted as volume
RUN mkdir -p /app/.next/cache/images

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "server.js"]
