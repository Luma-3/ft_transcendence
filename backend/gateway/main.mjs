import Fastify from 'fastify'
import http_proxy from '@fastify/http-proxy';
import gateway_config from './config/gateway.config.mjs'
import fs from 'fs'
import dotenv from 'dotenv'
import { InternalRoute } from './middleware/InternalRoute.mjs'

dotenv.config()

const fastify = Fastify({
  logger: true,
  https: {
    key: fs.readFileSync(process.env.SSL_KEY),
    cert: fs.readFileSync(process.env.SSL_CERT),
  },
});

const dev_prefix = process.env.NODE_ENV === 'development' ? '/api' : '';

const Services = [
  {
    name: 'Users Services', prefix: dev_prefix + '/user',
    upstream: process.env.NODE_ENV === 'development' ? 'https://localhost:3001' : 'https://user_api:3001',
    url: 'https://localhost:3000' + dev_prefix + '/user/doc/json',
    preHandler: InternalRoute
  },
  {
    name: 'Upload Services', prefix: dev_prefix + '/upload',
    upstream: process.env.NODE_ENV === 'development' ? 'https://localhost:3002' : 'https://upload_api:3002',
    url: 'https://localhost:3000' + dev_prefix + '/upload/doc/json',
    preHandler: InternalRoute
  }
]

gateway_config(fastify, Services);

Services.forEach((value) => {
  console.log(value);
  fastify.register(http_proxy, value);
})

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' })
    console.log(`Gateway listening on ${fastify.server.address().port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
};

start();
