# syntax=docker/dockerfile:1

# build
FROM node:18-slim AS build

RUN mkdir /app && chown -R node:node /app
WORKDIR /app

USER node

ARG VITE_APP_BASE_URL
ARG VITE_MATOMO_BASE_URL
ARG VITE_MATOMO_ID
ARG VITE_REDMINE_ID
ARG VITE_TYPESENSE_API_KEY
ARG VITE_TYPESENSE_PORT
ARG VITE_TYPESENSE_PROTOCOL
ARG VITE_TYPESENSE_HOST
ARG VITE_TYPESENSE_COLLECTION_PREFIX

COPY --chown=node:node .npmrc package.json package-lock.json ./
COPY --chown=node:node nuxt.config.ts tailwind.config.cjs tsconfig.json ./
COPY --chown=node:node scripts ./scripts
COPY --chown=node:node config ./config
COPY --chown=node:node public ./public
COPY --chown=node:node src ./src

RUN npm install --ci --no-audit --no-fund

ENV NODE_ENV=production

RUN npm run build

# serve
FROM node:18-slim AS serve

RUN mkdir /app && chown -R node:node /app
WORKDIR /app

USER node

COPY --from=build --chown=node:node /app/.output ./

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "./server/index.mjs"]
