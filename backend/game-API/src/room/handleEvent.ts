import { redisPub } from '../utils/redis.js';
import { NotFoundError } from '@transcenduck/error';

import { Room } from "../class/Room";
import { gameServiceType } from "./room.service.js";

export async function initGameEvent(gs: gameServiceType, room: Room, clientId: string, data: any) {
	redisPub.publish('ws.game.out', JSON
	.stringify({
		clientId: clientId,
		payload: {
			action: 'pong',
			data: {
				clientTime: data.clientTime,
				serverTime: Date.now()
			},
		}
	})
);
const player = room.getPlayerById(data.playerId);

if (!player) throw new NotFoundError('Player');

player.clientId = clientId;
redisPub.publish('ws.game.out', JSON
	.stringify({
		clientId: player.clientId,
		payload: {
			action: 'init',
			data: {
				roomId: room.id,
				playerId: player.playerId,
			},
		}
	}));

	if (room.status === 'roomReady') gs.broadcast(room, 'roomReady', room.roomData());

	gs.players.set(clientId, room);
}

export async function playerReadyEvent(gs: gameServiceType, room: Room, clientId: string) {
	const playerReady = room.getPlayerByClientId(clientId);

	if (!playerReady) throw new NotFoundError('Player');

	playerReady.ready = true;
	gs.broadcast(room, 'playerReady', room.roomData());

	console.log(`player with this client ID ${clientId} is ready to play !`);

	room.playerReady++;
	console.log(`number of player ready : ${room.playerReady} / ${room.maxPlayers}.`)

	if (room.playerReady == room.maxPlayers) {
		room.status = 'readyToStart';
		gs.createGameInRoom(room);
		gs.broadcast(room, 'readyToStart', room.roomData());
	}
}

export async function moveEvent(room: Room, clientId: string, data: any) {
	let whois = room.getPlayerByClientId(clientId);
	if (!whois) throw new NotFoundError('Player');      
	
	// if (!room.pong) throw new NotFoundError('Game');

	const validDirections = ['up', 'down', 'stop'];
	if (!validDirections.includes(data.direction)) {
		return;
	}

	room.pong?.movePaddle(whois!.playerId, data.direction);
	
	if (room.typeGame === 'localpvp') {
		if (!validDirections.includes(data.direction2)) {
			return;
		}
		
		room.pong?.movePaddle("", data.direction2);
	}
}