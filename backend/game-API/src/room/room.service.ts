// import { redisPub } from '../utils/redis.js';

// import { IPlayer, Room } from '../game/Room.js';
// import { PlayerType } from './player.schema.js';
import { ForbiddenError } from '@transcenduck/error';
import { IPlayer } from '../game/room/Room.js';
import { gameType } from './room.schema.js';
// import { GameType } from './room.schema.js';
// import { initGameEvent, moveEvent, playerReadyEvent } from './handleEvent.js';

// export type gameServiceType = GameService;

// 						Function				Class Statless Abstract
//
// Route <-> [Controller] <-> [Service] <-> [Model De Jeu (RAM)]
//																						Statfull

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

import { roomManagerInstance } from '../game/room/RoomManager.js';
import { handleEvent } from './handleEvent.js';

export class RoomService {

  static joinOrCreateRoom(player: IPlayer, game_name: string, type_game: gameType) {
    let room_id = undefined;

    room_id = roomManagerInstance.joinRoom(player);
    if (!room_id) {
      room_id = roomManagerInstance.createRoom(game_name, type_game);
      roomManagerInstance.joinRoom(player, room_id);
    }
    roomManagerInstance.startRoom(room_id);
    handleEvent(); // Start the event handler
    return room_id;
  }

  static joinRoom(player: IPlayer, room_id: string) {
    return roomManagerInstance.joinRoom(player, room_id);
  }

  static leaveCurrentRoom(player: IPlayer) {
    const room = roomManagerInstance.findCurrentRoom(player);
    if (!room) {
      throw new ForbiddenError("Player isn't in a Room");
    }
    roomManagerInstance.leaveRoom(player, room.id);
  }

  static getRoomById(room_id: string) {
    const room = roomManagerInstance.getRoomById(room_id);
    return room;
  }
}

// class GameService {
// 	players: Map<string, Room>
// 	rooms: Map<string, Room>;

// 	constructor() {
// 		this.players = new Map();
// 		this.rooms = new Map();
// 	}

// 		/**
// 	 * Trouve ou crée une salle disponible pour un joueur et l'y ajoute.
// 	 * 
// 	 * @param player - Le joueur à ajouter.
// 	 * @param typeGame - Le type de jeu souhaité.
// 	 * @returns L'identifiant de la salle rejointe.
// 	 */
// 	// createRoom(newPlayer: PlayerType, typeGame: GameType) {    
// 	// 	let room: Room | undefined;

// 	// 	/**
// 	// 	 * Vérifie si le joueur a deja lancer une partie.
// 	// 	 */
// 	// 	if (this.players.has(newPlayer.clientId)) {
// 	// 		room = this.players.get(newPlayer.playerId);
// 	// 	} else {
// 	// 		room = this.findJoinableRoom(typeGame)
// 	// 	}

// 	// 	if (!room) {
// 	// 		room = this.createRoom(typeGame);
// 	// 	}

// 	// 	this.addPlayerToRoom(room, newPlayer);
// 	// 	return room.id;
// 	// }

// 	/**
// 	 * Diffuse une action à tous les joueurs d'une salle donnée.
// 	 * 
// 	 * @param room - La salle cible.
// 	 * @param action - L'action à diffuser.
// 	 * @param data - Les données associées à l'action.
// 	 * @throws {NotFoundError} Si la salle n'existe pas ou que l'id est invalide.
// 	 */
// 	broadcast(room: Room, action: string, data: any) {
// 		if (!room || !room.id) {
// 			throw new NotFoundError('Room');
// 		}

// 		for (const player of room.players) {
// 			if (player?.clientId) {
// 				redisPub.publish('ws.game.out', JSON.stringify({
// 					clientId: player.clientId,
// 					payload: { action: action, data: data }
// 				}));
// 			}
// 		}
// 	}



// 	// createRoom(typeGame: GameType) {
// 	// 	const room = new Room(typeGame);
// 	// 	this.rooms.set(room.id, room);
// 	// 	return room;
// 	// }




// 	/**
// 	 * Récupère une salle par son identifiant.
// 	 * 
// 	 * @param roomId - L'identifiant de la salle.
// 	 * @returns L'instance Room si trouvée, sinon undefined.
// 	 */
// 	getRoom(roomId: string) { return this.rooms.get(roomId); }

// 	/**
// 	 * Ajoute un joueur à une salle donnée. Si la salle est pleine, crée une nouvelle salle du même type et y ajoute le joueur.
// 	 * Diffuse l'état de la salle après l'ajout du joueur.
// 	 * 
// 	 * @param room - La salle cible.
// 	 * @param player - Le joueur à ajouter.
// 	 * @throws {NotFoundError} Si la salle n'existe pas.
// 	 * @throws {InternalServerError} Si la création d'une nouvelle salle échoue.
// 	 */
// 	addPlayerToRoom(room: Room, player: PlayerType) {
// 		if (!room) {
// 			throw new NotFoundError('Room');
// 		}

// 		if (room.addPlayer(player) == false) {
// 			const newRoom = this.createRoom(room.typeGame);
// 			if (!newRoom) {
// 				throw new InternalServerError('Failed to create a new room');
// 			}
// 			newRoom.addPlayer(player);
// 			this.broadcast(newRoom, 'roomCreated', newRoom.roomData());
// 			return;
// 		}

// 		if (room.status === 'roomReady') {
// 			this.broadcast(room, 'roomReady', room.roomData());
// 		}
// 	}





// 	/**
// 	 * Cherche une salle disponible du type de jeu spécifié.
// 	 * 
// 	 * @param typeGame - Le type de jeu recherché.
// 	 * @returns L'identifiant d'une salle disponible, ou undefined si aucune n'est trouvée.
// 	 */
// 	findJoinableRoom(typeGame: GameType) {
// 		for (const room of this.rooms.values()) {
// 			if (room.typeGame === typeGame && room.isJoinable()) {
// 				return room;
// 			}
// 		}
// 		return undefined;
// 	}

// 	/**
// 	 * Crée une instance de jeu dans une salle donnée.
// 	 * 
// 	 * @param room - La salle cible.
// 	 * @throws {NotFoundError} Si la salle n'existe pas ou si la création échoue.
// 	 */
// 	createGameInRoom(room: Room) {
// 		if (!room) throw new NotFoundError('Room');

// 		const game = room.createGame();
// 		if (!game) throw new InternalServerError('Game creation failed');

// 		if (room.typeGame === 'localpve' && game) { game.isAgainstBot = true; }
// 	}

// 	/**
// 	 * Supprime une salle et arrête toute partie en cours.
// 	 * 
// 	 * @param room - La salle à supprimer.
// 	 * @throws {NotFoundError} Si la salle n'existe pas.
// 	 */
// 	deleteRoom(room: Room) {
// 		if (!room) throw new NotFoundError('Room');

// 		room.stopGame();
// 		room.status = 'finished';
// 		this.rooms.delete(room.id);
// 	}

// 	/**
// 	 * Gère un événement reçu d'un client (action joueur, changement d'état, etc).
// 	 * 
// 	 * @param clientId - L'identifiant du client.
// 	 * @param event - L'événement à traiter (type et données).
// 	 * @throws {InternalServerError} Pour les types d'événements inconnus ou opérations invalides.
// 	 */
// 	async handleEvent(clientId: string, event: { type: string, data: any }) {
// 		const data = event.data;
// 		const roomId = data.roomId;
// 		const room = this.getRoom(roomId);
// 		if (!room) throw new NotFoundError('Room');

// 		switch (event.type) {

// 			case 'init':
// 				initGameEvent(this, room, clientId, data);
// 				break;

// 			case 'playerReady':
// 				playerReadyEvent(this, room, clientId);
// 				break;

// 			case 'startGame':
// 				if (room.status === 'readyToStart')
// 					room.startGame();
// 				break;

// 			case 'resume' :
// 				if (room.pong) {
// 					room.pong.resume();
// 				} else {
// 					throw new NotFoundError('Game');
// 				}
// 				break;

// 			case 'pause':
// 				if (room.pong) {
// 					room.pong.pause();
// 				} else {
// 					throw new NotFoundError('Game');
// 				}
// 				break;

// 			case 'move':
// 				moveEvent(room, clientId, data);
// 				break;

// 			default:
// 				throw new InternalServerError(`Unknown event type: ${event.type}`);
// 		}
// 	}

// 	/**
// 	 * Permet à un joueur de quitter une salle.
// 	 * 
// 	 * @param roomId - L'identifiant de la salle.
// 	 * @param playerId - L'identifiant du joueur.
// 	 * @returns L'identifiant de la salle quittée.
// 	 * @throws {InternalServerError} Si la salle ou le joueur n'existe pas.
// 	 */
// 	leave_room(ClientId: string) {

// 		const room = this.players.get(ClientId);
// 		if (!room) {
// 			throw new NotFoundError('Room');
// 		}

// 		if (room.typeGame === "localpvp" || room.typeGame === "localpve") {
// 			this.deleteRoom(room);
// 			return undefined;
// 		}

// 		const player = room.getPlayerByClientId(ClientId);
// 		if (!player) {
// 			throw new NotFoundError('Player');
// 		}

// 		console.log(`Player ${player.playerId} left room ${room.id}`);

// 		room.removePlayer(player.playerId);
// 		this.broadcast(room, "leave", player);
// 	}
// }

// /**
//  * Instance unique de `GameService` pour la gestion globale des salles, joueurs et événements de jeu.
//  */
// export const gameService = new GameService();
