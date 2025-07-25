import fastify from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

import swagger from "./plugins/swagger.js";
import formatter from "@transcenduck/formatter";
import fastifyMultipart from "@fastify/multipart";

const isDev = process.env.NODE_ENV === 'development';

const server = fastify({
  ...(isDev && { logger: true }),
}).withTypeProvider<TypeBoxTypeProvider>();

await server.register(fastifyMultipart);
await server.register(formatter);

await server.register(swagger, {
  version: '1.0.0',
  title: 'Upload Service API',
  description: 'Endpoints for upload management',
  route: '/doc/json',
  servers: [
    { url: '/uploads/', description: 'Upload Service' }
  ],
  tags: [
    { name: 'Upload', description: 'Endpoints for uploading files' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
});
server.addHook('onSend', (request, reply, payload, done) => {
  const contentEncoding = reply.getHeader('Content-Encoding');
  done();
});

export default server;
