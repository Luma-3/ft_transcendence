import websocketPlugin from '@fastify/websocket';
import fp from 'fastify-plugin';
import { redisPub, redisSub } from '../config/redis.js';
import { FastifyPluginCallback } from 'fastify';
import { randomUUID } from 'node:crypto';

type SocketOptions = Parameters<typeof websocketPlugin>[1];

declare module 'fastify' {
  interface FastifyInstance {
    socket: typeof websocketPlugin;
    ws_clients: Map<string, Set<WebSocket>>;
  }
}

// TODO: Cloisonner les types de communications
//
// Naming convention for WebSocket/Redis message channels:
//
// Format: [From]:[Service]:[Scope]:[Target]
// ──────────────
// → From: identifies the source of the message.
//    Examples: 'ws', 'redis', 'game', 'chat', etc.
//
// → Service: identifies the domain or feature concerned by the message.
//    Examples: 'pong', 'chat', 'auth', 'gateway', 'all', etc.
//
// → Scope: defines **how** or **where** the message is routed.
//    Examples:
//      - 'out'       → output sent **to** a specific client
//      - 'room'      → message scoped to a specific game room
//      - 'broadcast' → sent to all clients or all rooms
//
// → Target: unique identifier for the message destination.
//    Examples:
//      - Room ID → e.g. 'abc123' for room-specific messages
//      - Player ID → e.g. 'u42' for per-player messages
//      - 'all' → for global broadcasts
//
//  ──────────────
//
//  WebSocket message format:
//  {
//    from: 'ws', // e.g. 'ws', 'redis', 'game', 'chat', etc.
//    service: 'game', // e.g. 'game', 'chat', etc.
//    scope: 'out', // e.g. 'out', 'room', 'broadcast'
//    target: 'abc123', // e.g. room ID, player ID, or 'all'
//    payload: { /* data */ }
//  }
//
// /!\ Importante Note: If message is sent by a WebSocket, the `from` field is always 'ws'. And Redis messages always have 'user_id' field next to `payload`

interface WebSocket extends globalThis.WebSocket {
  user_id: string; // User ID for the WebSocket connection
  id: string;
}

function handleMessage(socket: WebSocket, raw: string) {
  try {
    const { service, scope, target, payload } = JSON.parse(raw);
    if (!service || !scope || !target || !payload) {
      throw new Error('Invalid message format');
    }
    // Publish to Redis
    redisPub.publish(`ws:${service}:${scope}:${target}`, JSON.stringify({
      user_id: socket.user_id,
      ...payload
    }));
  } catch (err) {
    console.error('Error parsing message:', err);
  }
}

function handleError(socket: WebSocket, error: Error) {
  redisPub.publish(`ws:all:broadcast:all`, JSON.stringify({
    type: 'error',
    user_id: socket.user_id,
    payload: { error: error.message }
  }));
  socket.close(1011, 'Internal Server Error');
}

function handleClose(socket: WebSocket, code?: number, reason?: string) {
  console.warn(`[WS] client ${socket.user_id} disconnected: code=${code}, reason=${reason}`);
  redisPub.publish(`ws:all:broadcast:all`, JSON.stringify({
    type: 'disconnected',
    user_id: socket.user_id,
  }));
}

const plugin: FastifyPluginCallback<SocketOptions> = (fastify, opts, done) => {
  if (!fastify.socket) {
    fastify.register(websocketPlugin, opts);
  }

  fastify.decorate('ws_clients', new Map());

  fastify.register(async (fastify) => {
  fastify.get('/ws', { websocket: true }, async (socket, req) => {

    const user_id = req.headers['x-user-id'] as string;
      socket.user_id = user_id;
      socket.id = randomUUID();
      if (!fastify.ws_clients.has(user_id)) {
        fastify.ws_clients.set(user_id, new Set());
      }
      const keyRedis = 'sockets:' + user_id;
      if(await redisPub.sCard(keyRedis) == 0){
        redisPub.publish(`ws:all:broadcast:all`, JSON.stringify({
          type: 'connected',
          user_id: user_id
        }));
      }
      await redisPub.sAdd(keyRedis, socket.id);
      fastify.ws_clients.get(user_id)!.add(socket);

      socket.on('message', (raw: string) => {
        handleMessage(socket, raw);
      });

      socket.on('error', async (error: Error) => {
        const clients = fastify.ws_clients.get(user_id);
        await redisPub.sRem('sockets:' + user_id, socket.id);
        if (clients) {
          clients.delete(socket);
          if (clients.size === 0) {
            fastify.ws_clients.delete(user_id);
          }
        }
        if((await redisPub.sCard('sockets:' + socket.user_id) )=== 0){
            handleError(socket, error);
        }
      });

      socket.on('close', async () => {
        const clients = fastify.ws_clients.get(user_id);
        await redisPub.sRem('sockets:' + socket.user_id, socket.id);
        if (clients) {
          clients.delete(socket);
          if (clients.size === 0) {
            fastify.ws_clients.delete(user_id);
          }
        }
        if((await redisPub.sCard('sockets:' + socket.user_id) )=== 0){
            handleClose(socket, socket.closeCode, socket.closeReason);
        }
      });
    })
  });

  redisSub.pSubscribe('*:gateway:out:*', (message, channel) => {
    try {
      const [from, service, scope, target] = channel.split(':');
      const payload = JSON.parse(message);

      const user_id = target;
      
      const sockets = fastify.ws_clients.get(user_id);
      if (sockets) {
        sockets.forEach((socket) => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
              from: from,
              service: service,
              scope: scope,
              target: user_id,
              payload: payload
            }));
          } else {
            console.warn(`[WS] Socket for user ${user_id} is not open, skipping send.`);
          }
        });
      }
    }
    catch (err) {
      console.error('Error when handle outgoing message', err);
    }
  });
  done();
}

export default fp(plugin, { name: 'socket' });
