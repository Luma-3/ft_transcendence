import server from './fastify.js';
import dotenv from 'dotenv'

import roomRoute from './room/room.route.js';
import pendingRoute from './pending/public.routes.js';
import { IOInterface } from './utils/IOInterface.js';
import { TournamentManager } from './tournament/TournamentManager.js';
import { Player } from './core/runtime/Player.js';
import { RoomManager } from './core/runtime/RoomManager.js';

dotenv.config();

server.register(roomRoute);
server.register(pendingRoute);

// await handlerEvent();

IOInterface.subscribe("ws:all:broadcast:all", (message: string) => {
	const { type, user_id, payload } = JSON.parse(message);

	const player = new Player(user_id, "");
	const tournament = TournamentManager.getInstance().findCurrentTournament(player);
	if (tournament) {
		tournament[type](user_id, payload);
		return;
	}
	const room = RoomManager.getInstance().findCurrentRoom(player);
	if (room) {
		room[type](user_id, payload);
		return;
	}

});
const start = async () => {
	server.listen({ port: 3003, host: '0.0.0.0' }).then((address) => {
		console.log(`Server listening on ${address}`)
	}).catch((err) => {
		console.error(err)
		process.exit(1)
	});
}

start()