# syntax=docker/dockerfile:1
FROM node:24-bookworm-slim AS dependencies
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN npm ci

FROM dependencies AS build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM dependencies AS production-dependencies
RUN npm prune --omit=dev && npm cache clean --force

FROM node:24-bookworm-slim AS app
ENV NODE_ENV=production PORT=3000
WORKDIR /app
RUN chown node:node /app
COPY --from=production-dependencies --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json package-lock.json ./
COPY --from=build --chown=node:node /app/build ./build
COPY --chown=node:node public ./public
USER node
EXPOSE 3000
CMD ["node", "build/index.js"]
