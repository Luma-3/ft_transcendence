import { redisSub } from '../config/redis.js';

export async function postGame(req, rep) {
  const { player1_uid, player2_uid } = req.body;

  const gameId = this.GameService.createGame(player1_uid, player2_uid);

  return rep.code(201).send({ message: 'Game created', data: { gameId } });
}

export async function handlerEvent() {
  redisSub.subscribe('ws.game.in', (raw) => {
    const message = JSON.parse(raw);
    this.GameService.handlerEvent(message.clientId, message.payload);
  })
}
