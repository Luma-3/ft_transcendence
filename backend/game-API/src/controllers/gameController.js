import { redisSub } from '../config/redis.js';
import { gameService } from '../services/gameService.js';


export async function postGame(req, rep) {
  const { player1_uid, player2_uid } = req.body;

  const gameId = await gameService.createGame(player1_uid, player2_uid);
  console.log("Game created with ID:", gameId);
  return rep.code(201).send({ message: 'Game created', data: { id: gameId } });
}

export async function handlerEvent() {
  redisSub.subscribe('ws.game.in', (raw) => {
    const message = JSON.parse(raw);
    gameService.handleEvent(message.clientId, message.payload);
  })
}
