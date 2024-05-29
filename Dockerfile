FROM node:20-alpine3.19 as build

WORKDIR /app

# add package file
COPY package.json yarn.lock tsconfig.json ./

RUN yarn install --frozen-lockfile

# copy source
COPY . .

# build app
RUN yarn build

FROM node:20-alpine3.19

RUN apk add --no-cache curl

WORKDIR /app

COPY package.json yarn.lock tsconfig.json ./

RUN yarn install --frozen-lockfile

COPY --from=build /app/build ./build

# Copy public directory to the container
COPY public ./public

EXPOSE 3000

CMD ["yarn", "start"]