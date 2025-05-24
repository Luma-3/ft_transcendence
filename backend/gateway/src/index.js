import Fastify from 'fastify'
import http_proxy from '@fastify/http-proxy';
import { config_dev, registerPlugin } from './config/config.js'
import dotenv from 'dotenv'
import { InternalRoute } from './middleware/InternalRoute.js'

dotenv.config()

const fastify = Fastify(config_dev);


const Services = [
  {
    name: 'Users Services', prefix: '/user',
    upstream: 'http://' + process.env.USER_IP,
    url: '/api/user/doc/json',
    preHandler: InternalRoute
  },
  {
    name: 'Upload Services', prefix: '/upload',
    upstream: 'http://' + process.env.UPLOAD_IP,
    url: '/api/upload/doc/json',
    preHandler: InternalRoute
  },
  {
    name: 'Game Services', prefix: '/game',
    upstream: 'http://' + process.env.GAME_IP,
    url: '/api/game/doc/json',
  }
]

registerPlugin(fastify, Services);

Services.forEach((value) => {
  console.log(value);
  fastify.register(http_proxy, value);
})

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' })
    console.log(`Gateway listening on ${fastify.server.address().port}`)
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
