import Fastify from 'fastify'
import dotenv from 'dotenv'
import fs from 'fs'

import config from './config/fastify.config.js'

import user from './routes/user.js'
import session from './routes/session.js'
import preferences from './routes/preferences.js'

import { UserModel } from './models/userModel.js'
import { PreferencesModel } from './models/preferencesModel.js'
import { SessionModel } from './models/sessionModel.js'

import { UserService } from './services/userService.js'
import { SessionService } from './services/SessionService.js'

import { userSchemas } from './schema/user.schema.js'
import { preferencesSchema } from './schema/preferences.schema.js'
import { sessionSchemas } from './schema/session.schema.js'

dotenv.config()
const fastify = Fastify({
  logger: true,
  https: {
    key: fs.readFileSync(process.env.SSL_KEY),
    cert: fs.readFileSync(process.env.SSL_CERT),
  },
});

await config(fastify);

fastify.decorate('UserService', new UserService({
  models: {
    UserModel: new UserModel(fastify.knex),
    PreferencesModel: new PreferencesModel(fastify.knex)
  },
  utils: {
    knex: fastify.knex,
    bcrypt: fastify.bcrypt
  }
}));

fastify.decorate('SessionService', new SessionService({
  models: {
    UserModel: new UserModel(fastify.knex),
    SessionModel: new SessionModel(fastify.knex)
  },
  utils: {
    jwt: fastify.jwt,
    bcrypt: fastify.bcrypt
  }
}));

fastify.decorate('extractDbKeys', (schema) => {
  return Object.entries(schema.properties)
    .filter(([_, val]) => val.db !== false)
    .map(([key]) => key);
})

await userSchemas(fastify);
await preferencesSchema(fastify);
await sessionSchemas(fastify);

fastify.register(user);
fastify.register(session);
fastify.register(preferences);

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
