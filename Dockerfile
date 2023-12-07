# syntax=docker/dockerfile:1

# build
FROM node:20-slim AS build

RUN corepack enable

RUN mkdir /app && chown -R node:node /app
WORKDIR /app

USER node

COPY --chown=node:node .npmrc package.json pnpm-lock.yaml ./

RUN pnpm fetch

COPY --chown=node:node ./ ./

ARG NUXT_PUBLIC_APP_BASE_URL
ARG NUXT_PUBLIC_MATOMO_BASE_URL
ARG NUXT_PUBLIC_MATOMO_ID
ARG NUXT_PUBLIC_REDMINE_ID
ARG NUXT_PUBLIC_TYPESENSE_API_KEY
ARG NUXT_PUBLIC_TYPESENSE_COLLECTION_PREFIX
ARG NUXT_PUBLIC_TYPESENSE_HOST
ARG NUXT_PUBLIC_TYPESENSE_PORT
ARG NUXT_PUBLIC_TYPESENSE_PROTOCOL

RUN pnpm install --frozen-lockfile --offline

ENV NODE_ENV=production

RUN pnpm run build

# serve
FROM node:20-slim AS serve

RUN mkdir /app && chown -R node:node /app
WORKDIR /app

USER node

COPY --from=build --chown=node:node /app/.output ./

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "./server/index.mjs"]
