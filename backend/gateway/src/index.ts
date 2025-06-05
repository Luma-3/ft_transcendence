import app from './fastify.js'
import http_proxy from '@fastify/http-proxy';
import dotenv from 'dotenv'

dotenv.config()

const Services = [
  {
    name: 'Users Services', prefix: '/user',
    upstream: 'http://' + process.env.USER_IP,
    url: '/api/user/doc/json',
    // preHandler: InternalRoute
  },
  {
    name: 'Upload Services', prefix: '/uploads',
    upstream: 'http://' + process.env.UPLOAD_IP,
    url: '/api/upload/doc/json',
    // preHandler: InternalRoute
  },
  {
    name: 'Game Services', prefix: '/game',
    upstream: 'http://' + process.env.GAME_IP,
    url: '/api/game/doc/json',
  },
  {
    name: 'People Services', prefix: '/people',
    upstream: 'http://' + process.env.PEOPLE_IP,
    url: '/people/doc/json',
    // preHandler: InternalRoute
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
