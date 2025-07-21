import dotenv from 'dotenv'
import server from './fastify.js'

// User Routes
import userRoutes from './users/public.routes.js'
import userRoutesInternal from './users/internal.routes.js'

import preferencesRoutes from './preferences/public.routes.js'
import friendRoutes from './friends/public.routes.js'
import pendingRoutes from './pending/public.routes.js'
import blockedRoutes from './blocked/public.routes.js'
import searchRoutes from './search/public.routes.js'

// 2FA Routes
import twofaRoute from './twofa/public.routes.js'
import twofaRouteInternal from './twofa/internal.routes.js'
import { UserStatus } from './preferences/status.js'

dotenv.config()

// redisSub.subscribe('ws.test.in', (message, channel) => {
//   try {
//     const { clientId, payload } = JSON.parse(message);
//     console.log(`[WS][Redis] <- ${channel} -> client ${clientId}`);
//     console.log(`[WS][Redis] Payload: ${JSON.stringify(payload)}`);
//
//     // echo the message back to the client
//
//     redisPub.publish(`ws.${channel}.out`, JSON.stringify({
//       clientId: clientId,
//       payload: payload
//     }));
//   }
//   catch (err) {
//     console.error('Error when handle outgoing message', err);
//   }
// });


server.register(userRoutes);
server.register(userRoutesInternal);
server.register(preferencesRoutes);
server.register(friendRoutes);
server.register(pendingRoutes);
server.register(blockedRoutes);
server.register(searchRoutes);
server.register(twofaRoute);
server.register(twofaRouteInternal);

server.addHook('onRequest', async (req, _) => {
  console.log(`Header:${JSON.stringify(req.headers, undefined, 2)}`);
  return;
});


const start = async () => {
  server.listen({ port: 3001, host: '0.0.0.0' }, (err, address) => {
    if (err) {
      server.log.error(err)
      process.exit(1)
    }

    UserStatus.listenToUserStatusChanges();
    console.log(`Server listening at ${address}`)
  })
}
start()
