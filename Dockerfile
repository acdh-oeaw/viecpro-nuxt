# syntax=docker/dockerfile:1

# build
FROM node:22-slim AS build

RUN mkdir /app && chown -R node:node /app
WORKDIR /app

USER node

ARG NUXT_PUBLIC_APP_BASE_URL
ARG NUXT_PUBLIC_MATOMO_BASE_URL
ARG NUXT_PUBLIC_MATOMO_ID
ARG NUXT_PUBLIC_REDMINE_ID
ARG NUXT_PUBLIC_TYPESENSE_API_KEY
ARG NUXT_PUBLIC_TYPESENSE_PORT
ARG NUXT_PUBLIC_TYPESENSE_PROTOCOL
ARG NUXT_PUBLIC_TYPESENSE_HOST
ARG NUXT_PUBLIC_TYPESENSE_COLLECTION_PREFIX

COPY --chown=node:node .npmrc package.json package-lock.json ./
COPY --chown=node:node nuxt.config.ts tailwind.config.cjs tsconfig.json ./
COPY --chown=node:node scripts ./scripts
COPY --chown=node:node config ./config
COPY --chown=node:node public ./public
COPY --chown=node:node src ./
COPY --chown=node:node patches ./patches

RUN npm install --ci --no-audit --no-fund

ENV NODE_ENV=production

RUN npm run build

# serve
FROM node:22-slim AS serve

RUN mkdir /app && chown -R node:node /app
WORKDIR /app

USER node

COPY --from=build --chown=node:node /app/.output ./

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "./server/index.mjs"]
