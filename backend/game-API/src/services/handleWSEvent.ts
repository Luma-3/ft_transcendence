import { redisPub } from '../utils/redis.js';
import { NotFoundError } from '@transcenduck/error';

import { GameServiceType } from "./gameService";
import { Room } from "./Room";

export function init_game(gs: GameServiceType, room: Room, clientId: string, data: any) {
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

export function playerReady(gs: GameServiceType, room: Room, clientId: string) {
	const playerReady = room.getPlayerByClientId(clientId);

	if (!playerReady) throw new NotFoundError('Player');

	playerReady.ready = true;
	gs.broadcast(room, 'playerReady', room.roomData());

	room.playerReady++;
	if (room.playerReady == room.maxPlayers) {
		room.status = 'readyToStart';
		gs.createGameInRoom(room);
		gs.broadcast(room, 'readyToStart', room.roomData());
	}
}

export function move_players(room: Room, clientId: string, data: any) {
	let whois = room.getPlayerByClientId(clientId);
	if (!whois) throw new NotFoundError('Player');      
	
	if (!room.pong) throw new NotFoundError('Game');

	const validDirections = ['up', 'down', 'stop'];
	if (!validDirections.includes(data.direction)) {
		return;
	}

	room.pong.movePaddle(whois!.playerId, data.direction);
	
	if (room.typeGame === 'localpvp') {
		if (!validDirections.includes(data.direction2)) {
			console.error(`Invalid direction2: ${data.direction2}`);
			return;
		}
		
		room.pong.movePaddle("", data.direction2);
	}
}