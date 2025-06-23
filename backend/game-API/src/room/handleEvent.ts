import { roomManagerInstance } from '../game/room/RoomManager.js';
import { redisPub, redisSub } from '../utils/redis.js';

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
  room.startGame();
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

export async function sendBatchSnapshot(snapshot: any) {
  console.log("SendBatchSnapshot To Redis");
  const payload = {
    action: 'snapshot',
    gameData: snapshot
  };

  redisPub.publish('ws.game.out', JSON.stringify({
    user_id: snapshot.userId,
    payload: payload
  }));
}
