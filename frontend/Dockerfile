FROM node:22-alpine AS builder

WORKDIR /app

COPY ./website .

RUN npm install

RUN npm i -g vite

RUN vite build

FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]