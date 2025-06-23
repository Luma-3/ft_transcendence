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

//TODO: Cloisonner les types de communications
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
				try {
					const { type, payload } = JSON.parse(raw);
					console.log(`[WS] client ${user_id} -> ${type}`, payload);
					redisPub.publish(`ws.${type}.in`, JSON.stringify({
						user_id: socket.user_id,
						payload: payload
					}));
				}
				catch (err) {
					console.error('Error parsing message:', err);
				}
			});

			socket.on('close', () => {
				const userId = socket.user_id;
				fastify.ws_clients.delete(userId);
				redisPub.publish('ws.broadcast.disconnect', JSON.stringify({
					clientId: userId,
					payload: {}
				}));
				console.log(`[WS] client ${userId} disconnected`);
			});
		})
	});

	redisSub.pSubscribe('ws.*.out', (message, channel) => {
		try {
			const { user_id, payload } = JSON.parse(message);
			console.log(`[WS][Redis] <- ${channel} -> client ${user_id}`);
			const socket = fastify.ws_clients.get(user_id);
			if (socket) {
				socket.send(JSON.stringify({
					type: channel.split('.')[1],
					payload: payload
				}));
			}
			else {
				console.warn(`[WS][Redis] No socket found for user_id ${user_id} on channel ${channel}`);
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
