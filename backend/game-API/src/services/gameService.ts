import { redisPub } from '../utils/redis.js';

import { Room } from './Room.js';
import { PlayerType } from '../schemas/Player.js';
import { InternalServerError, NotFoundError } from '@transcenduck/error';
import { GameType } from '../schemas/Room.js';

/**
 * GameService : Service central de gestion des salles de jeu multijoueur.
 * 
 * La classe `GameService` orchestre la création, la gestion et la suppression des salles de jeu,
 * l'ajout et le retrait des joueurs, la diffusion des événements de jeu (via Redis) et le cycle de vie des parties.
 * 
 * Fonctionnalités principales :
 * - Création et recherche de salles selon le type de jeu demandé.
 * - Ajout automatique d'un joueur à une salle disponible ou création d'une nouvelle salle si besoin.
 * - Gestion de l'état des salles (attente, prêtes, en cours, terminées).
 * - Diffusion d'événements et d'actions à tous les joueurs d'une salle via Redis.
 * - Traitement des événements reçus des clients (connexion, préparation, mouvements, etc).
 * - Démarrage, arrêt et suppression des parties et salles.
 * 
 * Dépendances :
 * - Utilise la classe `Room` pour représenter une salle et gérer les joueurs/parties.
 * - Utilise les types `PlayerType` et `GameType` pour typer les joueurs et les jeux.
 * - Utilise `redisPub` pour publier les messages aux clients via WebSocket.
 * - Gère les erreurs via `InternalServerError` et `NotFoundError`.
 * 
 * Exemple d'utilisation :
 * ```typescript
 * const roomId = gameService.joinRoom(player, 'localpvp');
 * await gameService.handleEvent(clientId, { type: 'move', data: { roomId, direction: 'up' } });
 * ```
 */
class GameService {
  players: Map<string, Room>
  rooms: Map<string, Room>;

  constructor() {
    this.players = new Map();
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
   * Ajoute un joueur à une salle donnée. Si la salle est pleine, crée une nouvelle salle du même type et y ajoute le joueur.
   * Diffuse l'état de la salle après l'ajout du joueur.
   * 
   * @param room - La salle cible.
   * @param player - Le joueur à ajouter.
   * @throws {NotFoundError} Si la salle n'existe pas.
   * @throws {InternalServerError} Si la création d'une nouvelle salle échoue.
   */
  addPlayerToRoom(room: Room, player: PlayerType) {
    if (!room) {
      throw new NotFoundError('Room');
    }

    if (room.addPlayer(player) == false) {
      const newRoom = this.createRoom(room.typeGame);
      if (!newRoom) {
        throw new InternalServerError('Failed to create a new room');
      }
      newRoom.addPlayer(player);
      this.broadcast(newRoom, 'roomCreated', newRoom.roomData());
      return;
    }

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
    let room: Room | undefined;
    if (this.players.has(player.clientId)) {
      room = this.players.get(player.playerId);
    } else {
      room = this.findJoinableRoom(typeGame)
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
        return room;
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
    console.log(`Handling event: ${event.type} for client: ${clientId}`);
    console.log(`Event data: ${JSON.stringify(event.data)}`);
    const data = event.data;
    const roomId = data.roomId;
    const room = this.getRoom(roomId);
    if (!room) throw new NotFoundError('Room');

    switch (event.type) {

      case 'init':
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

          if (room.status === 'roomReady') this.broadcast(room, 'roomReady', room.roomData());

          this.players.set(clientId, room);

        break;

      case 'playerReady':
        const playerReady = room.getPlayerByClientId(clientId);

        if (!playerReady) throw new NotFoundError('Player');

        playerReady.ready = true;
        this.broadcast(room, 'playerReady', room.roomData());

        room.playerReady++;
        if (room.playerReady == room.maxPlayers) {
          room.status = 'readyToStart';
          this.createGameInRoom(room);
          this.broadcast(room, 'readyToStart', room.roomData());
        }
        break;
        
      case 'startGame':
        if (room.status === 'readyToStart')
          room.startGame();
        break;

      case 'resume' :
        if (room.pong) {
          room.pong.resume();
        } else {
          throw new NotFoundError('Game');
        }
        break;

      case 'pause':
        if (room.pong) {
          room.pong.pause();
        } else {
          throw new NotFoundError('Game');
        }
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

  /**
   * Permet à un joueur de quitter une salle.
   * 
   * @param roomId - L'identifiant de la salle.
   * @param playerId - L'identifiant du joueur.
   * @returns L'identifiant de la salle quittée.
   * @throws {InternalServerError} Si la salle ou le joueur n'existe pas.
   */
  leave_room(ClientId: string) {

    const room = this.players.get(ClientId);
    if (!room) {
      throw new NotFoundError('Room');
    }

    if (room.typeGame === "localpvp" || room.typeGame === "localpve") {
      this.deleteRoom(room);
      return undefined;
    }

    const player = room.getPlayerByClientId(ClientId);
    if (!player) {
      throw new NotFoundError('Player');
    }

    console.log(`Player ${player.playerId} left room ${room.id}`);

    room.removePlayer(player.playerId);
    this.broadcast(room, "leave", player);
  }
}

/**
 * Instance unique de `GameService` pour la gestion globale des salles, joueurs et événements de jeu.
 */
export const gameService = new GameService();
