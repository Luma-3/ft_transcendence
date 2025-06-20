import { roomManagerInstance } from '../game/RoomManager.js';
import { redisPub, redisSub } from '../utils/redis.js';
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

export async function SendRoomReady(roomId: string, userId: string) {
	console.log("SendReady To Redis");
	const payload = {
		action: 'roomReady',
		data: {
			roomId: roomId
		}
	};

	redisPub.publish('ws.game.out', JSON.stringify({
		user_id: userId,
		payload: payload
	}));
}

export async function sendReadyToStart(roomId: string, gameData: any) {
	console.log("SendReadyToStart To Redis");
	const payload = {
		action: 'readyToStart',
		data: {
			roomId: roomId,
			gameData: gameData
		}
	};

	redisPub.publish('ws.game.out', JSON.stringify({
		user_id: gameData.userId,
		payload: payload
	}));
}


async function playerReadyEvent(user_id: string, data: any) {
	const { roomId } = data;
	console.log("Player Ready Event for room:", roomId); // TODO : Passe to event Sys

	const room = roomManagerInstance.getRoomById(roomId);
	const payload = {
		action: 'playerReady',
		data: {
			user_id: user_id
		}
	}

	redisPub.publish('ws.game.out', JSON.stringify({
		user_id: room.players[0].user_id,
		payload: payload
	}))
	// redisPub.publish('ws.game.out', JSON.stringify({
	// 	user_id: room.players[1].user_id,
	// 	payload: payload
	// }));

	// TODO : deplacer la suite autre part
	redisPub.publish('ws.game.out', JSON.stringify({
		user_id: user_id,
		payload: {
			action: 'readyToStart',
			data: {
				roomId: roomId,
				gameData: {
					paddle1: {
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
				}
			}
		}
	}));
}

export async function handleEvent() {
	redisSub.subscribe('ws.game.in', (message) => {
		const { user_id, payload } = JSON.parse(message);
		switch (payload.type) {
			case 'playerReady':
				playerReadyEvent(user_id, payload.data);
		}
	})
}

// export async function broadcastEvent(event: any) {
// 	redisPub.publish('ws.game.out', JSON.stringify(event));
// 	console.log("Broadcasting event:", event);
// }