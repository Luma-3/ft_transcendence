import Fastify from 'fastify'
import http_proxy from '@fastify/http-proxy';
import gateway_config from './config/gateway.config.js'
import fs from 'fs'
import dotenv from 'dotenv'
import { InternalRoute } from './middleware/InternalRoute.js'

dotenv.config()

const fastify = Fastify({
  rewriteUrl(req) {
    if (req.url.startsWith('/api/') && process.env.NODE_ENV === "development") {
      return req.url.replace('/api', '');
    }
    return req.url;
  },
  logger: true,
  https: {
    key: fs.readFileSync(process.env.SSL_KEY),
    cert: fs.readFileSync(process.env.SSL_CERT),
  },
});

const Services = [
  {
    name: 'Users Services', prefix: '/user',
    upstream: 'https://' + process.env.USER_IP,
    url: '/user/doc/json',
    preHandler: InternalRoute
  },
  {
    name: 'Upload Services', prefix: '/upload',
    upstream: 'https://' + process.env.UPLOAD_IP,
    url: 'https://' + process.env.UPLOAD_IP + '/user/doc/json',
    preHandler: InternalRoute
  }
]

gateway_config(fastify, Services);

Services.forEach((value) => {
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
