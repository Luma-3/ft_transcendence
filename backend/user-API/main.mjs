import Fastify from 'fastify'
import dotenv from 'dotenv'
import fs from 'fs'

import config from './config/fastify.config.mjs'

import user from './routes/user.js'
import { UserModel } from './models/userModels.js'
import { userSchemas } from './schema/user.schema.js'

dotenv.config()

const fastify = Fastify({
  logger: true,
  https: {
    key: fs.readFileSync(process.env.SSL_KEY),
    cert: fs.readFileSync(process.env.SSL_CERT),
  },
});

config(fastify);

fastify.decorate('userModel', (new UserModel(fastify.knex)))
await userSchemas(fastify);

fastify.register(user);

const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' })
    console.log(`Server listening on ${fastify.server.address().port}`)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

start()
