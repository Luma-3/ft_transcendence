import app from './fastify.js'
import http_proxy from '@fastify/http-proxy';
import dotenv from 'dotenv';
import process from 'node:process';

import { internalRoutes } from './plugins/internalRoute.js';
import cluster from 'node:cluster';
const numClusterWorkers = 2;
if (cluster.isPrimary) {
  for (let i = 0; i < numClusterWorkers; i++) {
    cluster.fork();
  }

  cluster.on(
    "exit",
    (worker, _code, _signal) => console.log(`worker ${worker.process.pid} died`),
  );
} else {
dotenv.config()

const Services = [
  {
    name: 'Users Service', prefix: '/user',
    upstream: 'http://' + process.env.USER_IP,
    url: '/api/user/doc/json',
    preHandler: internalRoutes
  },
  {
    name: 'Upload Service', prefix: '/uploads',
    upstream: 'http://' + process.env.UPLOAD_IP,
    url: '/api/upload/doc/json',
    preHandler: internalRoutes
  },
  {
    name: 'Game Service', prefix: '/game',
    upstream: 'http://' + process.env.GAME_IP,
    url: '/api/game/doc/json',
    preHandler: internalRoutes
  },
  {
    name: 'People Service', prefix: '/people',
    upstream: 'http://' + process.env.PEOPLE_IP,
    url: '/people/doc/json',
    preHandler: internalRoutes
  },
  {
    name: 'Auth Service', prefix: '/auth',
    upstream: 'http://' + process.env.AUTH_IP,
    url: '/api/auth/doc/json',
    preHandler: internalRoutes
  }
]


Services.forEach((value) => {
  console.log(value);
  app.register(http_proxy, value);
})

const start = async () => {
  app.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
    if (err) {
      app.log.error(err)
      process.exit(1)
    }
    console.log(`Server listening at ${address}`)
  })
}
start();
}
