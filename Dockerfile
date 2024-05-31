# STAGE 1
FROM node:20-alpine3.19 as build
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package.json yarn.lock ./

USER node
RUN yarn install
COPY --chown=node:node . .
RUN yarn build

# STAGE 2
FROM node:20-alpine3.19 as app

RUN apk add dumb-init

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package.json yarn.lock ./
USER node

RUN yarn --production --frozen-lockfile
COPY --from=build /home/node/app/build ./build
COPY public ./public

ENV PORT 3000

EXPOSE 3000

CMD [ "dumb-init", "node", "build/index.js" ]