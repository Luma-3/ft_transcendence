import fastify from "fastify";
import cors from "@fastify/cors";
import socket from "./plugins/socket.js";
import forwardedFor from "./plugins/forwardedFor.js";
import cookie from "@fastify/cookie";
import jwt from "./plugins/jwt.js"
import dotenv from "dotenv";
import fs from "fs";
import process from "node:process";

dotenv.config();

const isDev = process.env.NODE_ENV === 'development';

const server = fastify({
  ...(isDev && { logger: true }),
  https: {
    key: fs.readFileSync('/etc/certs/www.transcenduck.fr.key'),
    cert: fs.readFileSync('/etc/certs/www.transcenduck.fr.crt'),
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
    { method: 'GET', url: '/auth/2fa/email' }, // Email verification (verification and resend)
    { method: 'PATCH', url: '/auth/2fa/email' }, // Email verification (verification and resend)
    { method: 'GET', url: '/user/users/register' }, // Confirm user registration
    { method: 'POST', url: '/auth/session' }, // Create session
    { method: 'DELETE', url: '/auth/session' }, // Delete session
    { method: 'POST', url: '/auth/session/2fa' }, // Create session after 2FA verification
    { method: 'PUT', url: '/auth/session' }, // Refresh token
    { method: 'GET', url: '/auth/oauth2/google' }, // Get Google OAuth2 authorization URL
    { method: 'GET', url: '/uploads/avatar' }, // Refresh token
    { method: 'GET', url: '/uploads/banner' }, // Refresh token
    { method: 'GET', url: /^\/[^\/]+\/doc\/json$/ }, // Swagger json
  ]
});

server.register(forwardedFor, {
  searcher: true,
});

export default server;
