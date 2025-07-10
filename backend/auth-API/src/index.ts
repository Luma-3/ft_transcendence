import server from './fastify.js'

import sessionRoute from './session/session.route.js'
import oauth2Route from './oauth2/oauth2.route.js'

// 2FA Routes
import twofaRoute from './twofa/public.routes.js'
import twofaRouteInternal from './twofa/internal.routes.js'

server.register(oauth2Route)
server.register(sessionRoute);
server.register(twofaRoute);
server.register(twofaRouteInternal);

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
