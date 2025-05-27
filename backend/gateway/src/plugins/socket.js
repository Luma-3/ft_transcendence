import websocketPlugin from '@fastify/websocket';
import fp from 'fastify-plugin';
import { redisPub, redisSub } from '../config/redis.js';

// 

function socket(fastify, opts, done) {
  if (!fastify.websocket) {
    fastify.register(websocketPlugin, opts);
  }

  fastify.decorate('ws_clients', new Map());

  fastify.register(async (fastify) => {
    fastify.get('/ws', { websocket: true }, async (socket, req) => {

      const clientId = req.headers['x-user-id'];
      fastify.ws_clients.set(clientId, socket);
      console.log(`[WS] client ${clientId} connected`);

      socket.on('message', (raw) => {
        try {
          const { type, payload } = JSON.parse(raw);

          console.log(`[WS] client ${clientId} -> ${type} -> Redis`);
          redisPub.publish(`ws.${type}.in`, JSON.stringify({
            clientId: clientId,
            payload: payload
          }));
        }
        catch (err) {
          console.error('Error parsing message:', err);
        }
      });

      socket.on('close', () => {
        fastify.ws_clients.delete(clientId);
        console.log(`[WS] client ${clientId} disconnected`);
      });
    })
  });

  redisSub.pSubscribe('ws.*.out', (message, channel) => {
    try {
      const { clientId, payload } = JSON.parse(message);
      console.log(`[WS][Redis] <- ${channel} -> client ${clientId}`);
      const socket = fastify.ws_clients.get(clientId);
      if (socket) {
        socket.send(JSON.stringify({
          type: channel.split('.')[1],
          payload: payload
        }));
      }
    }
    catch (err) {
      console.error('Error when handle outgoing message', err);
    }
  });
  done();
}

export default fp(socket, { name: 'socket' });

