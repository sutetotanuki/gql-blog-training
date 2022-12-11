# syntax=docker/dockerfile:1
FROM node:16

# Prisma CLIをdevDependenciesでインストールしたため
ENV NODE_ENV=development

WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
COPY prisma ./prisma
RUN yarn install
RUN yarn prisma generate
COPY . .
RUN yarn build

FROM node:16-stretch-slim AS runner
ENV NODE_ENV=production

# マイグレーションで必要
RUN apt-get -qy update
RUN apt-get -qy install openssl

WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
COPY prisma ./prisma
RUN yarn install
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
CMD ["yarn", "start:prod"]
