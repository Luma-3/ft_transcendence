import fastify from "fastify";
import cors from "@fastify/cors";
import socket from "@fastify/websocket";
import cookie from "@fastify/cookie";
import dotenv from "dotenv";
import fs from "fs";

// import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

// import swagger from "./plugins/swagger.js";

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

// await server.register(swagger, {
//   title: 'User Service API',
//   description: 'Endpoints for user management',
//   route: '/doc/json',
//   version: '1.0.0',
//   servers: [
//     { url: '/user/', description: 'User Service' }
//   ],
//   tags: [
//     { name: 'Users', description: 'Endpoints for managing user accounts and accessing personal or public user information.' },
//     { name: 'Sessions', description: 'Endpoints related to user session creation and termination.' },
//     { name: 'Preferences', description: 'Endpoints related to user preferences.' }
//   ],
//   components: {
//     securitySchemes: {
//       bearerAuth: {
//         type: 'http',
//         scheme: 'bearer',
//         bearerFormat: 'JWT'
//       }
//     }
//   }
// });


export default server;
