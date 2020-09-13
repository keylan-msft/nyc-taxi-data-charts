#front/Dockerfile

FROM node:12.2.0-alpine

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

CMD ["yarn", "run", "serve"]