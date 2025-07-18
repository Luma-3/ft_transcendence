FROM node:22 AS builder

WORKDIR /app

COPY package*.json ./
COPY vite.config.mts ./
COPY tsconfig.json ./
COPY index.html ./
COPY src ./src
COPY public ./public

RUN npm install

RUN npm i -g vite

RUN vite build

FROM nginx:stable-alpine

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /app/dist /usr/share/nginx/html


CMD ["nginx", "-g", "daemon off;"]
