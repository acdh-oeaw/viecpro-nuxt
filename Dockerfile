# syntax=docker/dockerfile:1-labs
# labs version is needed for `COPY --exclude`.
# @see https://docs.docker.com/reference/dockerfile/#copy---exclude

# using alpine base image to avoid `sharp` memory leaks.
# @see https://sharp.pixelplumbing.com/install#linux-memory-allocator

# build
FROM node:22-alpine AS build

RUN corepack enable

RUN mkdir /app && chown -R node:node /app
WORKDIR /app

USER node

COPY --chown=node:node .npmrc package.json pnpm-lock.yaml ./

RUN pnpm fetch

COPY --chown=node:node ./ ./

ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_APP_BASE_URL
ARG NEXT_PUBLIC_BOTS
ARG NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
ARG NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG
ARG NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME
ARG NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER
ARG NEXT_PUBLIC_KEYSTATIC_MODE
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

# to mount secrets which need to be available at build time
# @see https://docs.docker.com/build/building/secrets/
RUN --mount=type=secret,id=KEYSTATIC_GITHUB_CLIENT_ID,uid=1000 \
		--mount=type=secret,id=KEYSTATIC_GITHUB_CLIENT_SECRET,uid=1000 \
		--mount=type=secret,id=KEYSTATIC_SECRET,uid=1000 \
		KEYSTATIC_GITHUB_CLIENT_ID=$(cat /run/secrets/KEYSTATIC_GITHUB_CLIENT_ID) \
		KEYSTATIC_GITHUB_CLIENT_SECRET=$(cat /run/secrets/KEYSTATIC_GITHUB_CLIENT_SECRET) \
		KEYSTATIC_SECRET=$(cat /run/secrets/KEYSTATIC_SECRET) \
		pnpm run build

# serve
FROM node:22-alpine AS serve

RUN mkdir /app && chown -R node:node /app
WORKDIR /app

USER node

COPY --from=build --chown=node:node /app/next.config.ts ./
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
# exclude assets which should have been optimized with `next/image`.
COPY --from=build --chown=node:node --exclude=assets/content/assets/ /app/public  ./public
# content needs to be available at request time.
COPY --from=build --chown=node:node /app/content ./content

# ensure folder is owned by node:node when mounted as volume
RUN mkdir -p /app/.next/cache/images

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "server.js"]
