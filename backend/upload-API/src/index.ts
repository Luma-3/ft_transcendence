import Fastify from 'fastify';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import uplaodRoute from './routes/upload.js';
import config from './config/fastify.config.js';
import * as test from '@fastify/multipart';
import { AddressInfo } from 'net';

dotenv.config()

const fastify = Fastify({
  logger: true,

  // https: {
  //   key: fs.readFileSync(process.env.SSL_KEY),
  //   cert: fs.readFileSync(process.env.SSL_CERT),
  // },
   ajv: {
    // Adds the file plugin to help @fastify/swagger schema generation
    plugins: [
     test.ajvFilePlugin
    ]
  }
});

await config(fastify);
fastify.register(uplaodRoute);
const start = async () => {
  try {
    await fastify.listen({ port: 3002, host: '0.0.0.0' });
    console.log(`Server listen on ${(fastify.server.address() as AddressInfo).port}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
start();
