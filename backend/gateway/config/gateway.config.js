import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import swaggerUi from "@fastify/swagger-ui";

import jwt from "../plugins/jwt.js";
import swagger from "../plugins/swagger.js";

export default function(fastify, servers) {
  fastify.register(cookie);

  fastify.register(cors, {
    orgin: `https://${process.env.AUTHORIZED_IP}`,
    credentials: true
  });

  fastify.register(jwt, {
    secret: process.env.JWT_SECRET,
    sign: {
      iss: process.env.IP,
      expiresIn: '3d',
    },
    publicRoutes: [
      { method: 'POST', url: '/user/users' }, // Create user
      { method: 'POST', url: '/user/session' }, // Create session
      { method: 'POST', url: '/user/refresh' }, // Refresh token
      { method: 'GET', url: '/doc' }, // Swagger doc
      { method: 'GET', url: /^\/[^\/]+\/doc\/json$/ }, // Swagger json
    ]
  });

  fastify.register(swagger, {
    title: 'Transcenduck API',
    description: 'Official Documentation for all Services API Of Transcenduck Project',
    version: '1.0.0',
    servers: servers.map((value) => {
      return {
        url: value.prefix + '/',
        description: value.name
      }
    }),
  })

  fastify.register(swaggerUi, {
    routePrefix: '/doc',
    uiConfig: {
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      urls: servers
    },
    transformSpecification: (swaggerObject) => { return swaggerObject },
  })
};

