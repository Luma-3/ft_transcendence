import fastify from "fastify";
import cors from "@fastify/cors";
import socket from "@fastify/websocket";
import cookie from "@fastify/cookie";
import jwt from "./plugins/jwt.js"
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const server = fastify({
  logger: true,
  https: {
    key: fs.readFileSync('./cert/key.dev.pem'),
    cert: fs.readFileSync('./cert/cert.dev.pem'),
  }
});

server.register(cors, {
  origin: `https://${process.env.AUTHORIZED_IP}`,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
});

server.register(socket, {
  options: {
    perMessageDeflate: {
      threshold: 1024,
    },
  }
})

server.register(cookie, {
  secret: process.env.COOKIE_SECRET
});

server.register(jwt, {
  secret: process.env.JWT_SECRET!,
  publicRoutes: [
    { method: 'POST', url: '/user/users' }, // Create user
    { method: 'POST', url: '/auth/session' }, // Create session
    { method: 'PUT', url: '/auth/session' }, // Refresh token
    { method: 'GET', url: /^\/[^\/]+\/doc\/json$/ }, // Swagger json
  ]
});

export default server;
