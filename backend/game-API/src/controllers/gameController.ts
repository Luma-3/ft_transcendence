import { FastifyReply, FastifyRequest } from 'fastify';
import { redisSub } from '../utils/redis.js';
import { gameService } from '../services/gameService.js';
import { RoomParametersType, RoomPlayerParametersType } from '../schemas/Room.js';
import { PlayerInitialType, PlayerType } from '../schemas/Player.js';
import { NotFoundError } from '@transcenduck/error'

/**
 * Récupère les informations du joueur depuis la requête,
 * puis tente de l'ajouter à une salle via le service de jeu.
 * Retourne un code 201 avec l'identifiant de la salle si l'ajout est réussi,
 * ou un code 500 avec un message d'erreur en cas d'échec.
 * @param req - Requête Fastify contenant les informations du joueur (playerId, gameName, typeGame).
 * @param rep - Réponse Fastify.
 * @returns Réponse HTTP avec le résultat de l'opération.
 */
export async function postPlayer(req: FastifyRequest<{Body: PlayerInitialType}>, rep: FastifyReply) {
  const data = req.body;

  const player : PlayerType = {
    playerId: data.playerId,
    gameName: data.gameName,
    clientId: '0',
    joined: false,
    ready: false,
    score: 0
  };

  const roomId = gameService.joinRoom(player, data.typeGame);

  if (!roomId) {
    return rep.code(500).send({ message: 'Failed to join room' });
  }
  rep.code(201).send({ message: 'Player added to room', data: { id: roomId } });
}


/**
 * Récupère les informations d'une salle de jeu à partir de la requête.
 * 
 * Retourne un code 200 avec les informations de la salle si elle existe,
 * ou un code 500 avec un message d'erreur si la salle n'est pas trouvée.
 * @param req - Requête Fastify contenant les paramètres de la salle (roomId).
 * @param rep - Réponse Fastify.
 * @returns Réponse HTTP avec le résultat de l'opération.
 */
export async function getRoomInfo(req: FastifyRequest<{Params: RoomParametersType}>, rep: FastifyReply) {
  const roomId = req.params.roomId;
  const room = gameService.getRoom(roomId);

  if (!room) {
    return rep.code(500).send({ message: 'Room not found' });
  }

  return rep.code(200).send({ message: 'Room info retrieved', data: room.roomInfos() });
}

/**
 * Récupère la liste des joueurs d'une salle de jeu à partir de la requête.
 * 
 * Retourne un code 200 avec la liste des joueurs si la salle existe,
 * ou un code 500 avec un message d'erreur si la salle n'est pas trouvée.
 * @param req - Requête Fastify contenant les paramètres de la salle (roomId).
 * @param rep - Réponse Fastify.
 * @returns Réponse HTTP avec le résultat de l'opération.
 */
export async function getRoomPlayers(req: FastifyRequest<{Params: RoomParametersType}>, rep: FastifyReply) {
  const room = gameService.getRoom(req.params.roomId);

  if (!room) {
    throw new NotFoundError("Room");
  }

  console.log(room.toJSON().players);

  return rep.code(200).send({ message: 'Players list retrived', data: room.toJSON().players });
}

/**
 * Récupère les informations d'un joueur spécifique dans une salle de jeu à partir de la requête.
 *
 * Retourne un code 200 avec les informations du joueur si la salle et le joueur existent,
 * ou un code 500 avec un message d'erreur si la salle ou le joueur n'est pas trouvé.
 * @param req - Requête Fastify contenant les paramètres de la salle (roomId) et du joueur (playerId).
 * @param rep - Réponse Fastify.
 * @returns Réponse HTTP avec le résultat de l'opération.
 */
export async function getPlayerInfo(req: FastifyRequest<{Params: RoomPlayerParametersType}>, rep: FastifyReply) {
  const room = gameService.getRoom(req.params.roomId);
  if (!room) {
    return rep.code(500).send({ message: 'Room not found' });
  }

  const player = room.getPlayerById(req.params.playerId);
  if (!player) {
    return rep.code(500).send({ message: `Player not found in room ${req.params.roomId}` });
  }

  const playerInfo = {
    playerId: player.playerId,
    gameName: player.gameName,
    ready: player.ready
  }

  return rep.code(200).send({ message: 'Player infos retrived', data: playerInfo });
}

export async function getPlayerOpponentsInfo(req: FastifyRequest<{Params: RoomPlayerParametersType}>, rep: FastifyReply) {
  const room = gameService.getRoom(req.params.roomId);
  if (!room) {
    return rep.code(500).send({ message: 'Room not found' });
  }

  const player = room.getPlayerById(req.params.playerId);
  if (!player) {
    return rep.code(500).send({ message: 'player not found' });
  }

  const opponents = room.userOpponentInfos(player);

  return rep.code(200).send({ message: 'Player infos retrived', data: opponents });
}

/**
 * Gère les événements reçus via les canaux Redis pour le jeu.
 *
 * - Sur le canal 'ws.game.in', traite les événements de jeu entrants en appelant `gameService.handleEvent`
 *   avec l'identifiant du client et la charge utile de l'événement.
 * - Sur le canal 'ws.broadcast.disconnect', gère la déconnexion d'un client en supprimant la salle associée.
 *
 * @returns Promise<void> - Résout lorsque les abonnements aux événements sont en place.
 */
export async function handlerEvent() {
  redisSub.subscribe('ws.game.in', (raw: string) => {
    const message = JSON.parse(raw);
    gameService.handleEvent(message.clientId, message.payload);
  })

  redisSub.subscribe('ws.broadcast.disconnect', (raw: string) => {
    const message = JSON.parse(raw);
    gameService.leave_room());
  })
}
