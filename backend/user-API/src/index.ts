import dotenv from 'dotenv'
import server from './fastify.js'
import userRoutes from './routes/user.js'
import preferencesRouts from './routes/preferences.js'

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
server.register(preferencesRouts);

server.addHook('onRequest', async (req, _) => {
  console.log(`Header: ${req.headers['x-user-id']}, Username: ${req.headers['x-user-username']}`);
  return;
});


const start = async () => {
  server.listen({ port: 3001, host: '0.0.0.0' }, (err, address) => {
    if (err) {
      server.log.error(err)
      process.exit(1)
    }
    console.log(`Server listening at ${address}`)
  })
}
start()
