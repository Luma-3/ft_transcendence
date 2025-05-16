import Fastify from 'fastify';
import fs from 'fs';
import dotenv from 'dotenv';
import uplaodRoute from './routes/upload.js';
import { EditorImageService } from './services/EditorImageService.js';
import { UploadService } from './services/UploadService.js';
import config from './config/fastify.config.js';
import * as test from '@fastify/multipart';

dotenv.config()

const fastify = Fastify({
  logger: true,
  https: {
    key: fs.readFileSync(process.env.SSL_KEY),
    cert: fs.readFileSync(process.env.SSL_CERT),
  },
   ajv: {
    // Adds the file plugin to help @fastify/swagger schema generation
    plugins: [
     test.ajvFilePlugin
    ]
  }
});
await config(fastify);
fastify.register(uplaodRoute);
fastify.decorate("EditorImageService", new EditorImageService());
console.log(fastify.EditorImageService);
fastify.decorate('UploadService', new UploadService(fastify.EditorImageService));
const start = async () => {
  try {
    await fastify.listen({ port: 3002, host: '0.0.0.0' });
    console.log(`Server listen on ${fastify.server.address().port}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

start();
