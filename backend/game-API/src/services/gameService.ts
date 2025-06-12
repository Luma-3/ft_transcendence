import { redisPub } from '../utils/redis.js';

import { Room } from './Room.js';
import { PlayerType } from '../schemas/Player.js';
import { InternalServerError, NotFoundError } from '@transcenduck/error';
import { GameType } from '../schemas/Room.js';

/**
 * Service de gestion des salles de jeu, des joueurs et des événements de jeu.
 * 
 * La classe `GameService` fournit des méthodes pour créer, rejoindre et supprimer des salles de jeu,
 * gérer les joueurs dans ces salles, diffuser des événements aux joueurs et traiter les actions liées au jeu.
 * Elle maintient une map en mémoire des salles actives et coordonne le déroulement du jeu,
 * y compris le démarrage, la gestion de la préparation des joueurs et le traitement des actions en jeu.
 * 
 * @remarks
 * - Dépend des classes/types externes : `Room`, `PlayerType`, `GameType`, et `InternalServerError`.
 * - Utilise un publisher Redis (`redisPub`) pour diffuser les messages aux clients.
 * 
 * @example
 * ```typescript
 * const gameService = new GameService();
 * const player: PlayerType = { ... };
 * const roomId = gameService.joinRoom(player, 'localpvp');
 * gameService.handleEvent(clientId, { type: 'move', data: { roomId, direction: 'up' } });
 * ```
 */
class GameService {
  rooms: Map<string, Room>;

  constructor() {
    this.rooms = new Map();
  }

  /**
   * Diffuse une action à tous les joueurs d'une salle donnée.
   * 
   * @param room - La salle cible.
   * @param action - L'action à diffuser.
   * @param data - Les données associées à l'action.
   * @throws {NotFoundError} Si la salle n'existe pas ou que l'id est invalide.
   */
  broadcast(room: Room, action: string, data: any) {
    if (!room || !room.id) {
      throw new NotFoundError('Room');
    }

    for (const player of room.players) {
      if (player.clientId) {
        redisPub.publish('ws.game.out', JSON.stringify({
          clientId: player.clientId,
          payload: { action: action, data: data }
        }));
      }
    }
  }

  /**
   * Crée une nouvelle salle de jeu du type spécifié.
   * 
   * @param typeGame - Le type de jeu de la nouvelle salle.
   * @returns La nouvelle instance de Room.
   */
  createRoom(typeGame: GameType) {
    const room = new Room(typeGame);
    this.rooms.set(room.id, room);
    return room;
  }

  /**
   * Récupère une salle par son identifiant.
   * 
   * @param roomId - L'identifiant de la salle.
   * @returns L'instance Room si trouvée, sinon undefined.
   */
  getRoom(roomId: string) { return this.rooms.get(roomId); }

  /**
   * Ajoute un joueur à une salle donnée.
   * 
   * @param room - La salle cible.
   * @param player - Le joueur à ajouter.
   * @throws {NotFoundError} Si la salle n'existe pas.
   */
  addPlayerToRoom(room: Room, player: PlayerType) {
    if (!room) {
      throw new NotFoundError('Room');
    }

    room.addPlayer(player);
    if (room.status === 'roomReady') {
      this.broadcast(room, 'roomReady', room.roomData());
    }
  }

  /**
   * Trouve ou crée une salle disponible pour un joueur et l'y ajoute.
   * 
   * @param player - Le joueur à ajouter.
   * @param typeGame - Le type de jeu souhaité.
   * @returns L'identifiant de la salle rejointe.
   */
  joinRoom(player: PlayerType, typeGame: GameType) {
    let roomId = this.findJoinableRoom(typeGame);
    let room: Room | undefined;
    if (roomId) {
      room = this.getRoom(roomId);
    }
    if (!room) {
      room = this.createRoom(typeGame);
    }

    this.addPlayerToRoom(room, player);
    return room.id;
  }

  /**
   * Cherche une salle disponible du type de jeu spécifié.
   * 
   * @param typeGame - Le type de jeu recherché.
   * @returns L'identifiant d'une salle disponible, ou undefined si aucune n'est trouvée.
   */
  findJoinableRoom(typeGame: GameType) {
    for (const room of this.rooms.values()) {
      if (room.typeGame === typeGame && room.isJoinable()) {
        return room.id;
      }
    }
    return undefined;
  }

  /**
   * Crée une instance de jeu dans une salle donnée.
   * 
   * @param room - La salle cible.
   * @throws {NotFoundError} Si la salle n'existe pas ou si la création échoue.
   */
  createGameInRoom(room: Room) {
    if (!room) throw new NotFoundError('Room');

    const game = room.createGame();
    if (!game) throw new InternalServerError('Game creation failed');
    
    if (room.typeGame === 'localpve' && game) { game.isAgainstBot = true; }
  }

  /**
   * Supprime une salle et arrête toute partie en cours.
   * 
   * @param room - La salle à supprimer.
   * @throws {NotFoundError} Si la salle n'existe pas.
   */
  deleteRoom(room: Room) {
    if (!room) throw new NotFoundError('Room');

    room.stopGame();
    room.status = 'finished';
    this.rooms.delete(room.id);
  }

  /**
   * Gère un événement reçu d'un client (action joueur, changement d'état, etc).
   * 
   * @param clientId - L'identifiant du client.
   * @param event - L'événement à traiter (type et données).
   * @throws {InternalServerError} Pour les types d'événements inconnus ou opérations invalides.
   */
  async handleEvent(clientId: string, event: { type: string, data: any }) {
    const data = event.data;
    const roomId = data.roomId;
    const room = this.getRoom(roomId);
    if (!room) throw new NotFoundError('Room');

    switch (event.type) {

      case 'init':
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

          if (room.status === 'roomReady') this.broadcast(room, 'roomReady', room.roomData());

        break;

      case 'playerReady':
        const playerReady = room.getPlayerByClientId(clientId);

        if (!playerReady) throw new NotFoundError('Player');

        playerReady.ready = true;
        this.broadcast(room, 'playerReady', room.roomData());

        room.playerReady++;
        if (room.playerReady >= room.maxPlayers) {
          room.status = 'readyToStart';
          this.createGameInRoom(room);
          this.broadcast(room, 'readyToStart', room.roomData());
        }
        break;
        
      case 'startGame':
        if (room.status === 'readyToStart')
          if (room.startGame() === false) throw new InternalServerError('Game start failed');
        break;

      case 'move':
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
        break;

      default:
        throw new InternalServerError(`Unknown event type: ${event.type}`);
    }
  }

  // /**
  //  * Permet à un joueur de quitter une salle.
  //  * 
  //  * @param roomId - L'identifiant de la salle.
  //  * @param playerId - L'identifiant du joueur.
  //  * @returns L'identifiant de la salle quittée.
  //  * @throws {InternalServerError} Si la salle ou le joueur n'existe pas.
  //  */
  // leaveRoom(roomId, playerId) {
  //   const room = this.getRoom(roomId);
  //   if (!room) {
  //     throw new InternalServerError('Room not found');
  //   }
  //   const playerIndex = room.players.findIndex(p => p.uid === playerId);
  //   if (playerIndex === -1) {
  //     throw new InternalServerError('Player not found in the room');
  //   }
  //   room.players.splice(playerIndex, 1);
  //   if (room.players.length === 0) {
  //     this.deleteRoom(roomId); // Supprime la salle si plus de joueurs
  //   } else if (room.players.length < room.maxPlayers) {
  //     room.isFull = false; // La salle n'est plus pleine
  //     room.status = 'waiting'; // Change le statut à waiting
  //   }
  //   console.log(`Player ${playerId} left room ${roomId}`);
  //   return roomId;
  // }
}

/**
 * Instance unique de `GameService` pour la gestion globale des salles, joueurs et événements de jeu.
 */
export const gameService = new GameService();
