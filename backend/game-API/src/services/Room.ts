import { v4 as uuidv4 } from 'uuid';
import { Pong } from '../game/Pong.js';
import { PlayerType } from '../schemas/Player.js';
import { GameType, RoomInfoType } from '../schemas/Room.js';
import { NotFoundError, InternalServerError } from '@transcenduck/error';

type StatusType = 'waiting' | 'roomReady' | 'readyToStart' | 'playing' | 'finished';

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
	id: string;
	name: string = '';
	typeGame: GameType;
	status: StatusType = 'waiting';
	users: PlayerType[] = [];
	players: [PlayerType, PlayerType][] = [];
	pongs: Pong[] = [];
	isFull: boolean = false;
	createdAt: Date;
	maxPlayers: number;
	playerReady: number;
	private: boolean = false;
	
  constructor(typeGame: GameType) {
		this.id = uuidv4();
		this.typeGame = typeGame;
		if (typeGame === 'localpvp' || typeGame === 'localpve') {
			this.status = 'readyToStart';
		}
		this.createdAt = new Date();
		this.maxPlayers = typeGame === 'tournament' ? 8 : typeGame === 'online' ? 2 : 1; // Maximum number of players in the room
		this.playerReady = 0; // Counter for players ready to start the game
  }

	findPlayerInPairByPlayerId(playerId: string): PlayerType | undefined {
    for (const pair of this.players) {
        if (pair[0]?.playerId === playerId) {
            return pair[0];
        }
        if (pair[1]?.playerId === playerId) {
            return pair[1];
        }
    }
    return undefined;
	}

	/**
	 * Génére un tableau de paires de joueurs de manière aléatoire à partir des utilisateurs de la salle.
	 * Les paires sont stockées dans la propriété `players`.
	 * 
	 * @throws {Error} Si le nombre de joueurs est inférieur à 2.
	 */
	randomizePlayersPairs(): void {
		const shuffled = [...this.users];
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}

		for (let i = 0; i < shuffled.length; i += 2) {
			const p1 = shuffled[i];
			const p2 = shuffled[i + 1];
			this.players.push([p1, p2]);
		}
	}

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
  addPlayer(player: PlayerType): boolean {
		if (this.users.length >= this.maxPlayers) {
			return false;
		}

		this.users.push(player);
		if (this.users.length === this.maxPlayers) {
			this.isFull = true;
			this.randomizePlayersPairs();
			this.status = 'roomReady';
		}

		if (this.name === '' && this.typeGame !== "tournament") {
			this.name = `Room-${player?.gameName}`;
		} else if (this.name === '' && this.typeGame === "tournament") {
			this.name = `Tournament-${player?.gameName}`;
		}

		return true;
  }

	
	/**
	 * Récupère un joueur dans la salle à partir de son identifiant unique.
	 *
	 * @param playerId - L'identifiant unique du joueur à rechercher.
	 * @returns L'objet joueur s'il est trouvé ; sinon, retourne `undefined`.
	 */
	getPlayerById(playerId: string): PlayerType | undefined {
		for (const user of this.users) {
	  		if (user?.playerId === playerId) {
					return user;
	  		}
		}
		return undefined;
	}

	
	/**
	 * Recherche et retourne un joueur à partir de son identifiant client.
	 *
	 * Parcourt la liste des joueurs de la salle et retourne le joueur dont
	 * l'identifiant client correspond à celui fourni en paramètre. Si aucun joueur
	 * ne correspond, la fonction retourne `undefined`.
	 *
	 * @param clientId - L'identifiant unique du client à rechercher.
	 * @returns Le joueur correspondant à l'identifiant client, ou `undefined` si aucun joueur n'est trouvé.
	 */
  getPlayerByClientId(clientId: string): PlayerType | undefined {
		for (const user of this.users) {
			if (user?.clientId === clientId) {
				return user;
			}
		}
		return undefined;
	}

	/**
	 * Crée une nouvelle instance du jeu Pong avec les deux joueurs actuels de la salle.
	 * 
	 * @returns {Pong | null} Retourne l'instance du jeu Pong si la création a réussi, sinon null.
	 */
  createGame(): Pong | null {
		if (!this.users[0]) {
			throw new NotFoundError('Player 1');
		}

		const pong = new Pong (
			this.users[0].playerId,
			this.users[1]?.playerId
		)
		if (!pong) {
			return null;
		}
		this.pongs.push(pong);

		return pong;
  }

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
  removePlayer(playerId: string): "roomEmpty" | "playerRomoved" {
		if (this.typeGame === 'localpvp' || this.typeGame === 'localpve') {
			this.stopGame(pong);
		}

		const playerIndex = this.users.findIndex(user => user?.playerId === playerId);
		if (playerIndex === -1) {
			throw new NotFoundError('Player');
		}

		this.users.splice(playerIndex, 1);
		this.isFull = this.players.length >= this.maxPlayers;
		if (this.players.length === 0) {
			return "roomEmpty";
		}
		return "playerRomoved";
  }

	startTournamentGame() {
		if (this.typeGame !== "tournament") {
			return false;
		}
		for (const pong of this.pongs) {
			this.startGame(pong);
		}
		this.status = 'playing';
	}

	stopTournamentGame() {
		if (this.typeGame !== "tournament") {
			return false;
		}
		for (const pong of this.pongs) {
			this.stopGame(pong);
		}
		this.pongs = [];
		this.status = 'finished';
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
  startGame(pong: Pong): void {
		if (!pong) {
			throw new InternalServerError('Game not found');
		}
		pong.start();
		if (this.typeGame !== 'tournament') {
			this.status = 'playing';
		}
  }

	/**
	 * Arrête la partie en cours si elle existe.
	 *
	 * Cette méthode vérifie d'abord si une instance de jeu (`pong`) est présente.
	 * Si c'est le cas, elle appelle la méthode `stop()` sur cette instance pour arrêter la partie,
	 * puis réinitialise la référence à `pong` à `null`. Elle met également à jour le statut de la salle
	 * à 'finished' et indique que la salle n'est plus pleine.
	 */
  stopGame(pong: Pong) {
		if (!pong) {
			return;
		}
		pong.stop();
		if (this.typeGame !== 'tournament') {
			this.status = 'finished';
			this.isFull = false;
		}
  }

	/**
	 * Vérifie si la salle est disponible pour rejoindre.
	 *
	 * @returns {boolean} `true` si la salle n'est pas pleine et en attente, sinon `false`.
	 */
  isJoinable(): boolean { return (!this.isFull && this.status === 'waiting'); }

	/**
	 * Vérifie si la salle est prête à démarrer la partie.
	 *
	 * @returns {boolean} `true` si la salle est pleine ou si son statut est 'readyToStart', sinon `false`.
	 */
  isReadyToStart(): boolean { return (this.isFull || this.status === 'readyToStart'); }

	userInfos(player: PlayerType) {
		return {
			playerId: player?.playerId,
			gameName: player?.gameName,
			joined: player?.joined
		};
  }

  userOpponentsInfos(player: PlayerType) {
		return this.users.filter(p => p?.playerId !== player?.playerId).map(p => ({
			playerId: p?.playerId,
			gameName: p?.gameName,
			ready: p?.ready
		}));
  }

	userOpponentInfo(player: PlayerType) : PlayerType | undefined {
    for (const pair of this.players) {
        if (pair[0]?.playerId === player?.playerId) {
            return pair[1];
        }
        if (pair[1]?.playerId === player?.playerId) {
            return pair[0];
        }
    }
    return undefined;
	}

  roomData() {
		return {
			roomId: this.id,
			gameData: this.pong ? this.pong.toJSON() : null,
			typeGame: this.typeGame,
			players: this.players,
			//opponents: this.userOpponentInfos(player)
		};
  }

  roomInfos() : RoomInfoType {
		return {
			roomId: this.id,
			typeGame: this.typeGame,
			players: this.users.map(player => ({
				playerId: player!.playerId,
				gameName: player!.gameName,
			})),
		};
  }

  toJSON() {
    return {
			roomId: this.id,
			name: this.name,
			typeGame: this.typeGame,
			status: this.status,
			users: this.users.map(user => ({
				playerId: user!.playerId,
				gameName: user!.gameName,
				ready: user!.ready
			})),
			players: this.players.map(playerPair => [
				playerPair[0] ? {
					playerId: playerPair[0]?.playerId,
					gameName: playerPair[0]?.gameName,
					ready: playerPair[0]?.ready
				} : null,
				playerPair[1] ? {
					playerId: playerPair[1]?.playerId,
					gameName: playerPair[1]?.gameName,
					ready: playerPair[1]?.ready
				} : null
			]),
			isFull: this.isFull,
			createdAt: this.createdAt.toISOString(),
			maxPlayers: this.maxPlayers,
		};
  }
}
