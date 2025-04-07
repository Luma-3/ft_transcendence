FROM node:22-alpine AS builder

WORKDIR /app

COPY ./package.json ./

RUN npm install

COPY . .

RUN npm i -g vite

RUN vite build

FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]