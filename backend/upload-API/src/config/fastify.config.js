import fastifyMultipart from '@fastify/multipart'
import formatter from '@transcenduck/formatter'
import staticFile from "@fastify/static";
import path from "path";

import swagger from '../plugins/swagger.js'

export default async function config(fastify) {

  await fastify.register(formatter);
  await fastify.register(fastifyMultipart);

  await fastify.register(swagger, {
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

  // await fastify.register(staticFile, {
  //   root: path.join(__dirname, '../uploads/'),
  //   prefix: '/uploads/',
  // })
}
