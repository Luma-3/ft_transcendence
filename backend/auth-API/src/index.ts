import server from './fastify.js'

// Session Routes
import sessionRoute from './session/public.routes.js'
import sessionRouteInternal from './session/internal.routes.js'

import oauth2Route from './oauth2/public.routes.js'

// 2FA Routes
import twofaRoute from './twofa/public.routes.js'
import twofaRouteInternal from './twofa/internal.routes.js'

server.register(oauth2Route)
server.register(sessionRoute);
server.register(sessionRouteInternal);
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
