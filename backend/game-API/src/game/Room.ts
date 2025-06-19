import { v4 as uuidv4 } from 'uuid';
import { Pong } from './Pong.js';
import { gameType } from '../room/room.schema.js';
import { SendReady } from '../room/handleEvent.js';

type StatusType = 'waiting' | 'roomReady' | 'playersReady' | 'playing' | 'finished';

export interface IPlayer {
	user_id: string,
	player_name: string,
}

interface IGameInfos {
	name: string,
	type_game: gameType,
}

const MAX_PLAYER: number  = 2;

/**
 * Représente une salle de jeu pour différentes variantes de Pong.
 * 
 * Gère l'ajout et la suppression de joueurs, le statut de la salle,
 * la création et la gestion d'une partie de Pong, ainsi que diverses
 * informations sur la salle et ses participants.
 * 
 * @remarks
 * - Supporte plusieurs types de jeux (local, en ligne, tournoi).
 * - Permet de suivre l'état de la salle (attente, prête, en cours, terminée).
 * - Fournit des méthodes utilitaires pour accéder aux joueurs et aux données de la salle.
 */
export class Room {
	public readonly id: string;
	// private readonly name: string;
	private readonly gameType: gameType;

	private players: IPlayer[] = [];
	private status: StatusType = 'waiting';
	private readonly pong: Pong = new Pong; // TODO : Go to FACTORY Sys
	
	// private readonly createdAt: Date = new Date();
	// private playerReady: number = 0;

	// private roomPrivate: boolean = false; // Peut-etre ?
	
  constructor(gameInfos: IGameInfos) {
		this.id = uuidv4();
		// this.name = gameInfos.name;

		this.gameType = gameInfos.type_game;
		if (this.gameType == 'localpvp' || this.gameType == 'localpve') {
			this.status = 'roomReady';
		}
  }

	nbPlayers() { return this.players.length; }
	
	/**
	 * Ajoute un joueur à la salle si une place est disponible.
	 *
	 * @param player - L'objet joueur à ajouter à la salle.
	 * @returns `true` si le joueur a été ajouté avec succès ; `false` si la salle est déjà pleine.
	 *
	 * @remarques
	 * - Si la salle atteint sa capacité maximale après l'ajout du joueur, la propriété `isFull` passe à `true` et le statut de la salle devient `'roomReady'`.
	 * - Si la salle n'a pas de nom, il sera défini comme `Room-<player.gameName>`.
	 */
  addPlayer(player: IPlayer) {
		this.players.push(player);
	}


	/**
	 * Démarre la session de jeu pour la salle courante.
	 *
	 * @throws {InternalServerError} Si l'instance du jeu (`pong`) n'est pas trouvée.
	 *
	 * @remarques
	 * Cette méthode initialise la partie en appelant la méthode `start` sur l'instance `pong`
	 * et met à jour le statut de la salle à `'playing'`.
	 */
  startGame() {
		// TODO : Link LoopManager For Instantiate Game Objects
		// TODO: Attendre le construction paramètres du Pong
		// this.pong = new Pong()
		this.pong.start();
		this.status = 'playing';
		SendReady(this.id);
  }

	changeStatus(status: StatusType) {
		this.status = status;
	}

	/**
	 * Vérifie si la salle est disponible pour rejoindre.
	 *
	 * @returns {boolean} `true` si la salle n'est pas pleine et en attente, sinon `false`.
	 */
  isJoinable(): boolean { return (this.status === 'waiting' && this.nbPlayers() < MAX_PLAYER); }

	// TODO GET for HTTP Room Info
}
	
	/**
	 * Récupère un joueur dans la salle à partir de son identifiant unique.
	 *
	 * @param playerId - L'identifiant unique du joueur à rechercher.
	 * @returns L'objet joueur s'il est trouvé ; sinon, retourne `undefined`.
	 */
	// getPlayerById(playerId: string): PlayerType | undefined {
	// 	for (const player of this.players) {
	//   		if (player?.playerId === playerId) {
	// 				return player;
	//   		}
	// 	}
	// 	return undefined;
	// }

	// ! A voir si utils
	// /**
	//  * Recherche et retourne un joueur à partir de son identifiant client.
	//  *
	//  * Parcourt la liste des joueurs de la salle et retourne le joueur dont
	//  * l'identifiant client correspond à celui fourni en paramètre. Si aucun joueur
	//  * ne correspond, la fonction retourne `undefined`.
	//  *
	//  * @param clientId - L'identifiant unique du client à rechercher.
	//  * @returns Le joueur correspondant à l'identifiant client, ou `undefined` si aucun joueur n'est trouvé.
	//  */
  // getPlayerByUserId(clientId: string): PlayerType | undefined {
	// 	for (const player of this.players) {
	// 		if (player?.clientId === clientId) {
	// 			return player;
	// 		}
	// 	}
	// 	return undefined;
	// }

	

	/**
	 * Supprime un joueur de la salle en fonction de son identifiant.
	 *
	 * Si le type de jeu est 'localpvp' ou 'localpve', la partie en cours est arrêtée avant la suppression.
	 * Si le joueur n'est pas trouvé dans la salle, une exception NotFoundError est levée.
	 * Après suppression, la propriété `isFull` est mise à jour selon le nombre de joueurs restants.
	 *
	 * @param playerId - L'identifiant unique du joueur à supprimer.
	 * @returns "roomEmpty" si la salle est vide après la suppression, sinon "playerRomoved".
	 * @throws NotFoundError si le joueur n'est pas trouvé dans la salle.
	 */
  // removePlayer(playerId: string): "roomEmpty" | "playerRomoved" {
	// 	if (this.typeGame === 'localpvp' || this.typeGame === 'localpve') {
	// 		this.stopGame();
	// 	}

	// 	const playerIndex = this.players.findIndex(player => player?.playerId === playerId);
	// 	if (playerIndex === -1) {
	// 		throw new NotFoundError('Player');
	// 	}
	// 	// Remplace le joueur supprimé par undefined pour garder la paire [PlayerType, PlayerType]
	// 	this.players[playerIndex] = undefined;

	// 	this.isFull = this.nbPlayers() >= this.maxPlayers;
	// 	if (this.nbPlayers() === 0) {
	// 		return "roomEmpty";
	// 	}
	// 	return "playerRomoved";
  // }