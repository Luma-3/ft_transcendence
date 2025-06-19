import { redisPub } from '../utils/redis.js';
// import { NotFoundError } from '@transcenduck/error';

// import { Room } from "../game/Room.js";
// import { gameServiceType } from "./room.service.js";


// export async function moveEvent(room: Room, clientId: string, data: any) {
// 	// let whois = room.getPlayerByClientId(clientId);
// 	if (!whois) throw new NotFoundError('Player');      

// 	// if (!room.pong) throw new NotFoundError('Game');

// 	const validDirections = ['up', 'down', 'stop'];
// 	if (!validDirections.includes(data.direction)) {
// 		return;
// 	}

// 	// room.pong?.movePaddle(whois!.playerId, data.direction);

// 	if (room.typeGame === 'localpvp') {
// 		if (!validDirections.includes(data.direction2)) {
// 			return;
// 		}

// 		// room.pong?.movePaddle("", data.direction2);
// 	}
// }

export async function SendReady(roomId: string) {
	console.log("SendReady To Redis");
	redisPub.publish('ws.game.out', JSON.stringify({
		action: 'readyToStart',
		data: {
			gameData: {	paddle1: {
										y: 0,
										score: 0,
									},
									paddle2: {
										y: 0,
										score: 0,
									},
									ball: {
										x: 0,
										y: 0,
									}
			},
			roomId: roomId
	}}))
}