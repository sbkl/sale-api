FROM node:latest

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./
COPY prisma ./prisma/

RUN yarn

RUN yarn prisma:gen

COPY . .
COPY .env.production .env

RUN yarn build

RUN yarn copy-files

ENV NODE_ENV production

EXPOSE 8080

CMD ["yarn", "start"]

USER node