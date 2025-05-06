import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import swaggerUi from "@fastify/swagger-ui";

import jwt from "../plugins/jwt.mjs";
import swagger from "../plugins/swagger.mjs";

export default function(fastify, servers) {
  fastify.register(cookie);

  fastify.register(cors, {
    orgin: `https://${process.env.AUTHORIZED_IP}`,
    credentials: true
  });

  fastify.register(jwt, {
    secret: process.env.JWT_SECRET,
    sign: {
      iss: process.env.GATEWAY_IP,
      expiresIn: '3d',
    }
  });

  fastify.register(swagger, {
    title: 'APIs Documentation',
    description: 'doc'
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

