import dotenv from 'dotenv'
import server from './fastify.js'

import sessionRoute from './session/session.route.js'
import oauth2Route from './oauth2/oauth2.route.js'
import twofaRoute from './2FA/2fa.route.js'

server.register(oauth2Route)
server.register(sessionRoute);
server.register(twofaRoute);

const start = async () => {
  server.listen({ port: 3005, host: '0.0.0.0' }, (err, address) => {
    if (err) {
      server.log.error(err)
      process.exit(1)
    }
    console.log(`Server listening at ${address}`)
  })
}
start()
