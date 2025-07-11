import websocketPlugin from '@fastify/websocket';
import fp from 'fastify-plugin';
import { redisPub, redisSub } from '../config/redis.js';
import { FastifyPluginCallback } from 'fastify';

type SocketOptions = Parameters<typeof websocketPlugin>[1];

declare module 'fastify' {
  interface FastifyInstance {
    socket: typeof websocketPlugin;
    ws_clients: Map<string, WebSocket>;
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
}

function handleMessage(socket: WebSocket, raw: string) {
  try {
    const { service, scope, target, payload } = JSON.parse(raw);
    console.log(`[WS] client ${socket.user_id} -> ${service}:${scope}:${target}`, payload);
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
  console.error(`[WS] Error on client ${socket.user_id}:`, error);
  redisPub.publish(`ws:all:broadcast:all`, JSON.stringify({
    type: 'error',
    user_id: socket.user_id,
    payload: { error: error.message }
  }));
}

function handleClose(socket: WebSocket, code?: number, reason?: string) {
  console.log(`[WS] client ${socket.user_id} disconnected: code=${code}, reason=${reason}`);
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
      fastify.ws_clients.set(user_id, socket);
      console.log(`[WS] client ${user_id} connected`);

      socket.on('message', (raw: string) => {
        handleMessage(socket, raw);
      });

      socket.on('error', (error: Error) => {
        handleError(socket, error);
      });

      socket.on('close', () => {
        handleClose(socket, socket.closeCode, socket.closeReason);
        fastify.ws_clients.delete(user_id);
      });
    })
  });

  redisSub.pSubscribe('*:gateway:out:*', (message, channel) => {
    try {
      const [from, service, scope, target] = channel.split(':');
      const payload = JSON.parse(message);

      const user_id = target;

      // console.log(`[Redis] Received: ${channel} -> ${user_id} `, payload);
      const socket = fastify.ws_clients.get(user_id);
      if (socket) {
        socket.send(JSON.stringify({
          from: from,
          service: service,
          scope: scope,
          target: user_id,
          payload: payload
        }));
      }
      else {
        console.warn(`[WS][Redis] No socket found for user_id ${user_id} on channel ${channel} `);
      }
      // TODO faire un truc ici pour gerer l'erreur si on trouve pas le socket du gars
    }
    catch (err) {
      console.error('Error when handle outgoing message', err);
    }
  });
  done();
}

export default fp(plugin, { name: 'socket' });
