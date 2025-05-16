import Fastify from 'fastify'
import fs from 'fs'
import dotenv from 'dotenv'
import uplaodRoute from './routes/upload.js'
import { UploadService } from './services/UploadService.js'
import config from './config/fastify.config.js'

dotenv.config()

const fastify = Fastify({
  logger: true,
  https: {
    key: fs.readFileSync(process.env.SSL_KEY),
    cert: fs.readFileSync(process.env.SSL_CERT),
  },
});
await config(fastify);
fastify.register(uplaodRoute);
fastify.decorate('UploadService', new UploadService());
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
